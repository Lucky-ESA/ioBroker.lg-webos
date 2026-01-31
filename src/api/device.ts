import type { MulticastDNS } from "multicast-dns";
import mdns from "multicast-dns";
import { EventEmitter } from "node:events";
import { WebSocket } from "partysocket";
import { v4 as uuidv4 } from "uuid";
import type { ConfigDevice, Device, pointerJson, respCheck } from "../types/device";
import type { handshake } from "../types/handshake";
import type { AxiosResponse } from "../types/object";
import type { LGResponse } from "../types/response";
import { handshake_notpaired, handshake_paired } from "./handshake";
import { Endpoint, forbidden_ip, promisedWol, promisedWolAddress, webSocketClass } from "./helper";
import { creatObjects } from "./objects";
import { axoisRrequest } from "./request";
import { updateStates } from "./states";

/**
 * Device handler
 */
export class TVHandler extends EventEmitter implements Device {
    private adapter: ioBroker.Adapter;
    private mdn: MulticastDNS | null;
    private ws: WebSocket | null;
    private pointerWebSocket: WebSocket | null;
    private isConnected: boolean;
    private isPointerConnected: boolean;
    private isRegistered: boolean;
    private isFirstStart: boolean;
    private isSubscribe: boolean;
    private uri: string;
    private mac: string;
    private interval: number;
    private luna: boolean;
    private key: string | null;
    private ip: string | null;
    private dp: string | undefined;
    private v4: Map<string, ioBroker.Message | string> = new Map<string, ioBroker.Message | string>();
    private reqResp: [string, respCheck][] = [];
    private objects: creatObjects;
    private states: updateStates;
    private errorCount: number;
    private delayTimeout: ioBroker.Timeout | undefined;
    private checkCallback: ioBroker.Timeout | undefined;
    private subscribeChannel: ioBroker.Timeout | undefined;
    private pointerCheck: ioBroker.Timeout | undefined;
    private checkTVStatus: ioBroker.Interval | undefined;
    private startWebSocketDelay: ioBroker.Timeout | undefined;
    private log: boolean;
    private pair: handshake;
    private getRequest: axoisRrequest;
    private socketPath: string;
    private openPointerRequest: pointerJson;
    private isSettings: string[] = [];
    private isStart: boolean = false;
    private closeWS: string = "";

    /**
     * Device
     *
     * @param iob iobroker ulits
     * @param device adapter config
     */
    constructor(
        readonly iob: ioBroker.Adapter,
        readonly device: ConfigDevice,
    ) {
        super();
        this.adapter = iob;
        this.getRequest = new axoisRrequest();
        this.mdn = null;
        if (device.ws == "ws") {
            this.uri = `ws://${device.ip}:3000`;
        } else {
            this.uri = `wss://${device.ip}:3001`;
        }
        this.ip = device.ip;
        this.dp = device.dp;
        this.mac = device.mac;
        this.interval = device.interval;
        this.luna = device.luna;
        this.key = null;
        this.isConnected = false;
        this.isRegistered = false;
        this.isFirstStart = true;
        this.isSubscribe = false;
        this.isPointerConnected = false;
        this.ws = null;
        this.pointerWebSocket = null;
        this.errorCount = 0;
        this.delayTimeout = undefined;
        this.checkCallback = undefined;
        this.subscribeChannel = undefined;
        this.checkTVStatus = undefined;
        this.pointerCheck = undefined;
        this.startWebSocketDelay = undefined;
        this.objects = new creatObjects(device, iob);
        this.states = new updateStates(device, iob);
        this.log = false;
        this.pair = handshake_notpaired;
        this.socketPath = "";
        this.openPointerRequest = {
            type: undefined,
            uri: undefined,
            payload: undefined,
            first: undefined,
            prefix: undefined,
        };
        void this.onReady();
    }

    /**
     * Start Class
     */
    private async onReady(): Promise<void> {
        await this.objects.createDevice();
        const state = await this.adapter.getStateAsync(`${this.dp}.system.pair_code`);
        if (state && state.val && typeof state.val === "string" && state.val.includes("aes-192-cbc")) {
            this.key = this.adapter.decrypt(state.val);
            this.pair = handshake_paired;
            this.pair["client-key"] = this.key;
            this.adapter.log.debug(`Key: ${this.key}`);
        }
        const respSettings = await this.adapter.getStateAsync(`${this.dp}.status.possibleSettings`);
        if (
            respSettings &&
            respSettings.val &&
            typeof respSettings.val === "string" &&
            respSettings.val.startsWith("[")
        ) {
            try {
                const allSettings: string[] = JSON.parse(respSettings.val);
                if (typeof allSettings === "object" && allSettings.length > 0) {
                    this.isSettings = allSettings;
                }
            } catch (error: unknown) {
                if (typeof error === "string") {
                    this.adapter.log.error(`${error}`);
                } else if (error instanceof Error) {
                    this.adapter.log.error(`${error.name}: ${error.message}`);
                }
            }
        }
        const respStart = await this.adapter.getStateAsync(`${this.dp}.status.responseStart`);
        if (respStart && respStart.val && typeof respStart.val === "string" && respStart.val.startsWith("[")) {
            try {
                const allStarts: any = JSON.parse(respStart.val);
                if (typeof allStarts === "object" && allStarts.length > 0) {
                    this.isStart = true;
                    for (const allStar of allStarts) {
                        this.reqResp.push([
                            allStar[0].toString(),
                            typeof allStar[1] === "object" ? allStar[1] : JSON.parse(allStar[1]),
                        ]);
                    }
                }
            } catch (error: unknown) {
                if (typeof error === "string") {
                    this.adapter.log.error(`${error}`);
                } else if (error instanceof Error) {
                    this.adapter.log.error(`${error.name}: ${error.message}`);
                }
            }
        }
        this.adapter.log.debug(JSON.stringify(this.reqResp));
        this.adapter.log.debug(JSON.stringify(this.isSettings));
        this.startWebSocket();
    }

    /**
     * Start Web Socket
     */
    private startWebSocket(): void {
        this.ws = new WebSocket(this.uri, undefined, {
            WebSocket: webSocketClass({
                rejectUnauthorized: false,
            }),
            connectionTimeout: 1000,
            minReconnectionDelay: 1000,
            maxReconnectionDelay: 1000,
        });
        this.ws.addEventListener("message", async message => {
            this.errorCount = 0;
            this.closeWS = "";
            this.isConnected = true;
            this.adapter.log.debug(`LGTV message for ${this.uri}`);
            if (message && message.data) {
                this.adapter.log.debug(`Message: ${JSON.stringify(message.data)}`);
                try {
                    const payload = JSON.parse(message.data);
                    this.adapter.log.debug(`Payload: ${JSON.stringify(payload)}`);
                    this.setResponseValue(payload);
                    if (payload && payload.id) {
                        const type = this.v4.get(payload.id);
                        this.adapter.log.debug(`Type Response ${JSON.stringify(type)}`);
                        if (payload.type == "response") {
                            if (type == "First") {
                                void this.createStateFirst(payload);
                            } else if (type == "Own") {
                                void this.ownRequest(payload);
                            } else if (
                                type &&
                                this.dp &&
                                typeof type !== "object" &&
                                JSON.stringify(type).includes(this.dp)
                            ) {
                                void this.isSendRequest(
                                    typeof type === "string" ? type : JSON.stringify(type),
                                    payload,
                                );
                            } else if (typeof type === "object" && type.callback) {
                                this.adapter.sendTo(type.from, type.command, payload, type.callback);
                            } else {
                                void this.updateStates(payload);
                            }
                        } else if (payload.type == "error") {
                            if (type == "Own") {
                                void this.ownRequest(payload);
                            } else if (typeof type === "object" && type.callback) {
                                this.adapter.sendTo(type.from, type.command, payload, type.callback);
                            }
                            if (payload.error == "403 cancelled") {
                                void this.updateStates({ type: "error", id: "", payload: { appId: "" } });
                            }
                            this.adapter.log.debug(`Error Response ${payload.error}`);
                        } else if (type == "register") {
                            if (payload.type == "response" || payload.type == "PROMPT") {
                                this.adapter.log.warn(
                                    `Starting pairing with the TV. Please confirm the pairing on the TV.`,
                                );
                            } else if (
                                payload.type == "registered" &&
                                payload.payload &&
                                payload.payload["client-key"]
                            ) {
                                this.adapter.log.debug(`${payload.payload["client-key"]}`);
                                this.adapter.log.debug(`${this.key}`);
                                if (!this.key || this.key != payload.payload["client-key"]) {
                                    this.key = payload.payload["client-key"];
                                    if (typeof this.key === "string") {
                                        if (this.pair["client-key"] == null) {
                                            this.pair = handshake_paired;
                                        }
                                        this.pair["client-key"] = this.key;
                                        await this.adapter.setState(`${this.dp}.system.pair_code`, {
                                            val: this.adapter.encrypt(this.key),
                                            ack: true,
                                        });
                                        this.isRegistered = true;
                                        void this.getDeviceInfos();
                                    }
                                } else {
                                    this.isRegistered = true;
                                    void this.getDeviceInfos();
                                }
                            }
                        }
                        if (type != "register" && payload.type != "PROMPT") {
                            this.v4.delete(payload.id);
                        }
                        this.adapter.log.debug(`Count: ${this.v4.size}`);
                        if (this.v4.size > 20) {
                            this.v4.clear();
                        }
                    }
                } catch (error: unknown) {
                    if (typeof error === "string") {
                        this.adapter.log.error(`Message: ${error}`);
                    } else if (error instanceof Error) {
                        this.adapter.log.error(`Message: ${error.name}: ${error.message}`);
                    }
                }
                void this.setResponse();
            }
        });

        this.ws.addEventListener("error", (error: Error) => {
            this.closeWS = "";
            if (error && error.message) {
                this.adapter.log.debug(`Error: ${error.message}`);
                if (error.message == "TIMEOUT") {
                    if (this.errorCount > 15) {
                        void this.startWatching();
                        this.adapter.log.info(`Devices ${this.ip} likely offline. Start MDNS monitoring.`);
                        this.errorCount = 16;
                    }
                }
            }
            this.checkOpenMessage();
            this.isConnected = false;
            this.isRegistered = false;
            ++this.errorCount;
        });

        this.ws.addEventListener("open", open => {
            if (this.closeWS == "Try Again Later (EWS)") {
                this.adapter.log.debug(`LGTV ${this.uri} shutdown`);
                return;
            }
            this.isConnected = true;
            void this.updateStatus(true);
            this.errorCount = 0;
            this.adapter.log.info(`LGTV ${this.uri} opened`);
            if (open && open.returnValue) {
                this.adapter.log.info(`Open: ${JSON.stringify(open.returnValue)}`);
            }
            if (typeof this.key !== "string" || !this.isRegistered) {
                if (!this.key || this.key == "") {
                    this.adapter.log.warn(`Start pairing!!!`);
                }
                this.sendCommand("register", undefined, this.pair);
            }
        });

        this.ws.addEventListener("close", close => {
            if (this.closeWS == "Try Again Later (EWS)") {
                this.adapter.log.debug(`LGTV ${this.uri} shutdown`);
                return;
            }
            this.isConnected = false;
            this.isRegistered = false;
            void this.updateStatus(false);
            this.adapter.log.debug(`LGTV ${this.uri} closed`);
            if (close && close.reason) {
                this.adapter.log.debug(`Close: ${JSON.stringify(close.reason)}`);
                this.closeWS = JSON.stringify(close.reason);
            }
            this.checkOpenMessage();
        });
    }

    /**
     * Start Pointer Web Socket
     */
    private startpointerWebSocket(): void {
        if (this.socketPath == "") {
            this.adapter.log.warn(`Cannot found cursor address!!!`);
            return;
        }
        this.pointerWebSocket = new WebSocket(this.socketPath, undefined, {
            WebSocket: webSocketClass({
                rejectUnauthorized: false,
            }),
            connectionTimeout: 2000,
            minReconnectionDelay: 10000,
            maxReconnectionDelay: 10000,
        });

        this.pointerWebSocket.addEventListener("message", message => {
            this.adapter.log.debug(`LGTV cursor connection ${this.uri} message`);
            this.isPointerConnected = true;
            if (message && message.data) {
                this.adapter.log.debug(`Message: ${JSON.stringify(message.data)}`);
            }
        });

        this.pointerWebSocket.addEventListener("error", async (error: Error) => {
            this.isPointerConnected = false;
            if (this.isPointerConnected) {
                await this.updatePointerStatus(false);
            }
            this.adapter.log.debug(`LGTV cursor connection ${this.uri} error`);
            if (error && error.message) {
                this.adapter.log.debug(`Error: ${error.message}`);
            }
        });

        this.pointerWebSocket.addEventListener("open", async open => {
            this.isPointerConnected = true;
            this.getPointerCheck();
            await this.updatePointerStatus(true);
            this.adapter.log.debug(`LGTV cursor connection ${this.uri} opened`);
            if (open && open.returnValue) {
                this.adapter.log.info(`Open cursor: ${JSON.stringify(open.returnValue)}`);
            }
            if (this.openPointerRequest.first && this.openPointerRequest.type && this.openPointerRequest.uri) {
                this.sendCommand(
                    this.openPointerRequest.type,
                    this.openPointerRequest.uri,
                    this.openPointerRequest.payload,
                    this.openPointerRequest.first,
                    this.openPointerRequest.prefix,
                );
            }
        });

        this.pointerWebSocket.addEventListener("close", async close => {
            await this.updatePointerStatus(false);
            if (this.isPointerConnected) {
                await this.updatePointerStatus(false);
            }
            this.adapter.log.debug(`LGTV cursor connection ${this.uri} closed`);
            if (close && close && close.reason) {
                this.adapter.log.debug(`Close cursor: ${JSON.stringify(close.reason)}`);
            }
        });
    }

    /**
     * Close pointer websocket after 5 minutes
     */
    private getPointerCheck(): void {
        this.pointerCheck && this.adapter.clearTimeout(this.pointerCheck);
        this.pointerCheck = this.adapter.setTimeout(
            () => {
                if (this.pointerWebSocket) {
                    this.pointerWebSocket.close();
                    this.pointerWebSocket = null;
                }
                this.pointerCheck = undefined;
                void this.updatePointerStatus(false);
            },
            60 * 1000 * 5,
        );
    }

    /**
     * Create States after restart
     *
     * @param val LGResponse
     */
    private async ownRequest(val: LGResponse): Promise<void> {
        await this.adapter.setState(`${this.dp}.remote.own_request.response`, { val: JSON.stringify(val), ack: true });
        await this.setAckFlag(`${this.dp}.remote.own_request.request`);
    }

    /**
     * Set ack flag
     *
     * @param objectId ioBroker object id
     */
    private async isSendRequest(objectId: string, res: LGResponse): Promise<void> {
        await this.setAckFlag(objectId);
        if (
            objectId != "" &&
            objectId.includes("keys.screenshot") &&
            res.payload &&
            res.payload.returnValue &&
            res.payload.imageUri != ""
        ) {
            void this.saveScreenshot(res.payload.imageUri as string);
        }
    }

    /**
     * Save screenshots
     *
     * @param url Icon URL
     */
    private async saveScreenshot(url: string): Promise<void> {
        this.adapter.log.debug(`Screenshot: ${url}`);
        const resp: AxiosResponse = await this.getRequest.get(url);
        if (resp && resp.data) {
            const file = url.split(".");
            const ext = file.pop();
            const filename = new Date().getTime();
            await this.adapter.writeFileAsync(`${this.adapter.namespace}`, `screenshot/${filename}.${ext}`, resp.data);
        } else {
            this.adapter.log.error(JSON.stringify(resp));
        }
    }

    /**
     * Set Online Status
     *
     * @param val boolean
     */
    private async updateStatus(val: boolean): Promise<void> {
        await this.adapter.setState(`${this.dp}.status.online`, { val: val, ack: true });
        if (!val) {
            const available = this.getRespRequestFind(Endpoint.GET_POWER_STATE, "uri");
            if (available && available[1] && available[1].response == "response") {
                await this.adapter.setState(`${this.dp}.status.powerState`, { val: "unknown", ack: true });
            }
        }
        this.emit("update", this.dp, val);
    }

    /**
     * Set Online Status for cursor connection
     *
     * @param val boolean
     */
    private async updatePointerStatus(val: boolean): Promise<void> {
        await this.adapter.setState(`${this.dp}.status.pointerConnection`, { val: val, ack: true });
    }

    /**
     * Save response
     */
    private async setResponse(): Promise<void> {
        await this.adapter.setState(`${this.dp}.status.responseStart`, {
            val: JSON.stringify(this.reqResp),
            ack: true,
        });
    }

    /**
     * Save first response
     */
    private async setFirstResponse(): Promise<void> {
        await this.sleep(5000);
        await this.adapter.setState(`${this.dp}.status.responseStart`, {
            val: JSON.stringify(this.reqResp),
            ack: true,
        });
        const settings = [];
        for (const r of this.reqResp) {
            if (
                r[1].settings != "No Value" &&
                r[1].settings != "" &&
                r[1].category == "picture" &&
                !r[1].settings.includes(",")
            ) {
                settings.push(r[1].settings);
            }
        }
        this.isSettings = settings;
        await this.adapter.setState(`${this.dp}.status.possibleSettings`, { val: JSON.stringify(settings), ack: true });
    }

    /**
     * Create States after restart
     *
     * @param val LGResponse
     */
    private async createStateFirst(val: LGResponse): Promise<void> {
        if (val.payload.devices) {
            await this.objects.createInput(val);
            this.states.updateInuptValue(val);
        } else if (val.payload.volumeStatus) {
            await this.objects.createOutput(val);
        } else if (val.payload.scenario) {
            await this.objects.createOutputOld(val);
        } else if (val.payload.channelList) {
            await this.objects.createChannelList(val);
        } else if (val.payload.product_name) {
            await this.objects.createSystem(val);
        } else if (typeof val.payload.settings === "object") {
            await this.objects.createSettings(val);
        } else if (val.payload.launchPoints) {
            await this.objects.createLaunch(val);
        } else if (val.payload.features || val.payload.configs) {
            await this.objects.createFeatures(val);
            if (
                (val.payload.features && val.payload.features["3d"]) ||
                (val.payload.configs && val.payload.configs["tv.model.3dSupportType"] == "3D")
            ) {
                let first: string | null = null;
                if (this.isFirstStart) {
                    first = "First";
                }
                this.sendCommand("subscribe", Endpoint.GET_3D_STATUS, null, first);
            }
        } else if (val.payload.apps) {
            await this.objects.createApps(val);
        } else if (val.payload.socketPath != null && val.payload.socketPath != "") {
            this.socketPath = val.payload.socketPath;
            await this.objects.createPointerConnection();
        } else if (val.payload.state) {
            await this.objects.createPowerState(val);
        } else if (val.payload.channel) {
            await this.states.updateChannel(val);
        } else if (val.payload.channelTypeName) {
            await this.states.updateChannelSwitch(val);
        } else if (val.payload.appId && val.payload.appId != "") {
            await this.states.updateAppId(val);
        }
    }

    /**
     * Update States
     *
     * @param val LGResponse
     */
    private async updateStates(val: LGResponse): Promise<void> {
        this.adapter.log.debug(`Update: ${JSON.stringify(val)}`);
        if (val.payload.appId != null && val.payload.appId != "") {
            await this.states.updateAppId(val);
            if (val.payload.appId == "com.webos.app.livetv") {
                this.subscribeChannel = this.adapter.setTimeout(async () => {
                    this.sendCommand("subscribe", Endpoint.GET_CURRENT_CHANNEL, null, null);
                    await this.sleep(100);
                    this.sendCommand("subscribe", Endpoint.GET_CURRENT_PROGRAM_INFO, null, null);
                    this.isSubscribe = true;
                    this.subscribeChannel = undefined;
                }, 3000);
            } else {
                await this.states.cleanUpChannel();
                if (this.isSubscribe) {
                    this.sendCommand("unsubscribe", Endpoint.GET_CURRENT_CHANNEL, null, null);
                    await this.sleep(100);
                    this.sendCommand("unsubscribe", Endpoint.GET_CURRENT_PROGRAM_INFO, null, null);
                    this.isSubscribe = false;
                }
                this.subscribeChannel && this.adapter.clearTimeout(this.subscribeChannel);
                this.subscribeChannel = undefined;
            }
        } else if (val.payload.volumeStatus) {
            await this.states.updateOutput(val);
        } else if (typeof val.payload.settings === "object") {
            await this.states.updateSettings(val);
        } else if (val.payload.state) {
            await this.states.updatePowerState(val);
            if (val.payload.state == "Suspend") {
                void this.startWatching();
            }
        } else if (val.payload.channel) {
            await this.states.updateChannel(val);
        } else if (val.payload.channelTypeName) {
            await this.states.updateChannelSwitch(val);
        } else if (val.payload.programId) {
            await this.states.updateProgram(val);
        } else if (val.payload.socketPath != null && val.payload.socketPath != "") {
            this.socketPath = val.payload.socketPath;
        } else if (val.payload.appId != null && val.payload.appId == "") {
            this.isConnected = false;
            this.isRegistered = false;
            void this.startWatching();
            this.adapter.log.info(`Devices ${this.ip} likely offline. Start MDNS monitoring.`);
        } else if (val.payload.changed) {
            await this.states.updateOutputOld(val);
        }
        await this.adapter.setState(`${this.dp}.remote.own_request.responseSubscribe`, {
            val: JSON.stringify(val),
            ack: true,
        });
    }

    /**
     * Request device infos
     */
    private async getDeviceInfos(): Promise<void> {
        let first: string | null = null;
        if (this.isFirstStart) {
            first = "First";
        }
        let check: [string, respCheck] | undefined = undefined;
        this.sendCommand("subscribe", Endpoint.SEND_REGISTER, null, first);
        await this.sleep(100);
        check = this.getRespRequestFind(Endpoint.GET_SERVICES, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand("request", Endpoint.GET_SERVICES, null, first);
            await this.sleep(100);
        }
        this.sendCommand("request", Endpoint.GET_AUDIO_STATUS, null, first);
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_APPS_ALL, null, first);
        await this.sleep(100);
        this.sendCommand("request", Endpoint.GET_SOFTWARE_INFO, null, first);
        await this.sleep(100);
        check = this.getRespRequestFind(Endpoint.GET_SYSTEM_INFO, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand("request", Endpoint.GET_SYSTEM_INFO, null, first);
            await this.sleep(100);
        }
        this.sendCommand("request", Endpoint.GET_CHANNEL_INFO, null, first);
        await this.sleep(100);
        check = this.getRespRequestFind(Endpoint.GET_POWER_STATE, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand("subscribe", Endpoint.GET_POWER_STATE, null, first);
            await this.sleep(100);
        }
        check = this.getRespRequestFind(Endpoint.GET_CONFIGS, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand(
                "subscribe",
                Endpoint.GET_CONFIGS,
                { configNames: ["tv.model.*", "tv.rmm.*", "tv.hw.*", "system.*", "tv.config.*", "tv.conti.*"] },
                first,
            );
            await this.sleep(100);
        }
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_CURRENT_CHANNEL, null, first);
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_CURRENT_PROGRAM_INFO, null, first);
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_SOUND_OUTPUT, null, first);
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_VOLUME, null, first);
        await this.sleep(100);
        check = this.getRespRequestFind(Endpoint.GET_TV_TIME, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand("request", Endpoint.GET_TV_TIME, null, first);
            await this.sleep(100);
        }
        this.sendCommand("request", Endpoint.GET_TV_CHANNELS, null, first);
        await this.sleep(100);
        this.sendCommand("subscribe", Endpoint.GET_INPUTS, null, first);
        await this.sleep(100);
        this.sendCommand("request", Endpoint.INPUT_SOCKET, null, first);
        await this.sleep(100);
        check = this.getRespRequestFind(Endpoint.GET_TV_TIME, "uri");
        if (check == undefined || (check[1] && check[1].response == "response")) {
            this.sendCommand("subscribe", Endpoint.LIST_DEVICES, null, first);
            await this.sleep(100);
        }
        this.sendCommand("subscribe", Endpoint.GET_APPS, null, first);
        await this.sleep(100);
        this.sendCommand(
            "subscribe",
            Endpoint.GET_SYSTEM_SETTINGS,
            { category: "network", keys: ["deviceName"] },
            first,
        );
        await this.sleep(100);
        this.sendCommand(
            "subscribe",
            Endpoint.GET_SYSTEM_SETTINGS,
            { category: "network", keys: ["wolwowlOnOff"] },
            first,
        );
        await this.sleep(100);
        /**
        this.sendCommand("subscribe", Endpoint.GET_APP_STATUS, null, first);
        await this.sleep(100);
        this.sendCommand(
            "subscribe",
            Endpoint.GET_SYSTEM_SETTINGS,
            { category: "option", keys: ["audioGuidance"] },
            first,
        );
        await this.sleep(100);
        this.sendCommand(
            "subscribe",
            Endpoint.GET_SYSTEM_SETTINGS,
            { category: "sound", keys: ["soundOutput", "soundMode"] },
            first,
        );
        await this.sleep(100);
        this.sendCommand(
            "subscribe",
            Endpoint.GET_SYSTEM_SETTINGS,
            {
                category: "time",
                keys: ["timeZone"],
            },
            first,
        );
        await this.sleep(100);
         */
        const keys = [
            "contrast",
            "backlight",
            "brightness",
            "color",
            "energySaving",
            "pictureMode",
            "sharpness",
            "dynamicContrast",
            "peakBrightness",
            "gamma",
            "motionEyeCare",
            "colorGamut",
            "hdrDynamicToneMapping",
            "blackLevel",
            "realCinema",
            "tint",
            "noiseReduction",
            "mpegNoiseReduction",
            "smoothGradation",
            "dynamicColor",
            "eyeComfortMode",
        ];
        if (this.isSettings.length > 0) {
            this.sendCommand(
                "subscribe",
                Endpoint.GET_SYSTEM_SETTINGS,
                {
                    category: "picture",
                    keys: this.isSettings,
                },
                first,
            );
            await this.sleep(100);
        } else if (this.reqResp && this.reqResp.length > 0) {
            for (const key of keys) {
                this.sendCommand(
                    "subscribe",
                    Endpoint.GET_SYSTEM_SETTINGS,
                    {
                        category: "picture",
                        keys: [key],
                    },
                    first,
                );
                await this.sleep(100);
            }
        }
        this.sendCommand("subscribe", Endpoint.GET_CURRENT_APP_INFO, null, first);
        await this.sleep(100);
        if (this.isFirstStart) {
            void this.setFirstResponse();
        }
        this.isFirstStart = false;
        if (this.interval > 0) {
            this.startCheckStatus(true);
        }
    }

    /**
     * Check status TV disabled/enabled
     */
    private startCheckStatus(start: boolean): void {
        this.checkTVStatus && this.adapter.clearInterval(this.checkTVStatus);
        this.checkTVStatus = undefined;
        if (start) {
            this.checkTVStatus = this.adapter.setInterval(() => {
                const available = this.getRespRequestFind(Endpoint.GET_POWER_STATE, "uri");
                if (available && available[1] && available[1].response == "response") {
                    this.sendCommand("request", Endpoint.GET_POWER_STATE, null, null);
                } else {
                    const tv_time = this.getRespRequestFind(Endpoint.GET_TV_TIME, "uri");
                    if (tv_time && tv_time[1] && tv_time[1].response == "response") {
                        this.sendCommand("request", Endpoint.GET_TV_TIME, null, null);
                    } else {
                        this.adapter.log.debug(`No request works!!!`);
                    }
                }
            }, this.interval * 1000);
        }
    }

    /**
     * Send Callback
     *
     * @param obj Message
     */
    public sendObjCallback(obj: ioBroker.Message, message: any): void {
        if (obj.callback) {
            this.adapter.sendTo(obj.from, obj.command, message, obj.callback);
        }
    }

    /**
     * Start MDNS Service
     */
    private async startWatching(): Promise<void> {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.pointerWebSocket) {
            this.pointerWebSocket.close();
            this.pointerWebSocket = null;
        }
        this.isSubscribe = false;
        void this.updateStatus(false);
        void this.updatePointerStatus(false);
        this.checkOpenMessage();
        this.startCheckStatus(false);
        this.v4.clear();
        this.closeWS = "";
        await this.sleep(3000);
        this.startMulticast();
    }

    /**
     * Start MDNS Service
     */
    private startMulticast(): void {
        this.startWebSocketDelay && this.adapter.clearTimeout(this.startWebSocketDelay);
        this.startWebSocketDelay = undefined;
        if (!this.mdn) {
            this.mdn = mdns();
            this.mdn.query({
                questions: [
                    {
                        name: "_services._dns-sd._udp.local",
                        type: "PTR",
                    },
                ],
            });
            this.adapter.log.debug(`Watching response!`);
            this.mdn.on("response", (response: { answers: any[]; additionals: any[]; id: number }) => {
                if (this.log) {
                    this.adapter.log.info(`MDN: ${JSON.stringify(response)}`);
                }
                const device = response.answers.find(dev => dev.data == this.ip);
                let isOnline = false;
                if (device != undefined) {
                    if (device.type == "A" || device.type == "AAAA") {
                        if (device.flush) {
                            isOnline = true;
                        }
                    }
                } else {
                    const oldDevice = response.additionals.find(dev => dev.data == this.ip);
                    if (oldDevice != undefined) {
                        if (oldDevice.type == "A" || oldDevice.type == "AAAA") {
                            if (response.id > 0) {
                                isOnline = true;
                            }
                        }
                    }
                }
                if (isOnline) {
                    this.adapter.log.info(`Found device ${this.ip}`);
                    this.mdn?.destroy();
                    this.mdn = null;
                    this.delayStartWebSocket();
                }
            });
        }
    }

    /**
     * Start WebSocket
     */
    private delayStartWebSocket(): void {
        this.startWebSocketDelay && this.adapter.clearTimeout(this.startWebSocketDelay);
        this.startWebSocketDelay = this.adapter.setTimeout(() => {
            this.startWebSocket();
            void this.updateStatus(true);
            this.startWebSocketDelay = undefined;
        }, 3 * 1000);
    }

    /**
     * Sends a alert message
     *
     * @param id ioBroker object id
     * @param type Message type
     * @param uri Endpoint
     * @param payload Payload data
     * @param prefix - URI prefix
     */
    public async MessageHandler(
        id: string,
        type: string,
        uri?: string,
        payload?: any,
        prefix = `ssap://`,
    ): Promise<void> {
        this.adapter.log.debug(JSON.stringify({ id: id, type: type, uri: uri, payload: payload, prefix: prefix }));
        let dp_message = "createToast";
        let dp_close = "closeToast";
        let attribute = "toastId";
        if (type === "createAlert" || type === "closeAlert") {
            dp_message = "createAlert";
            dp_close = "closeAlert";
            attribute = "alertId";
        }
        const obj: any = await this.adapter.getObjectAsync(`${this.dp}.remote.notify.${dp_close}`);
        if (obj) {
            await this.setAckFlag(id);
            const messageId = await this.sendPromiseCommand("request", uri, payload, prefix);
            this.adapter.log.debug(`MessageId: ${JSON.stringify(messageId)}`);
            if (type === dp_message) {
                if (messageId && messageId.payload && messageId.payload[attribute]) {
                    obj.common.states[messageId.payload[attribute]] = payload.message;
                }
            } else {
                if (obj.common.states[payload[attribute]]) {
                    delete obj.common.states[payload[attribute]];
                }
            }
            await this.adapter.setObject(`${this.dp}.remote.notify.${dp_close}`, obj);
            await this.adapter.setState(`${this.dp}.remote.notify.${dp_close}`, { val: "no", ack: true });
        }
    }

    /**
     * Sends a message
     *
     * @param id ioBroker object id
     * @param type Message type
     * @param uri Endpoint
     * @param payload Payload data
     * @param prefix - URI prefix
     */
    public request(id: string, type: string, uri?: string, payload?: any, prefix = `ssap://`): void {
        this.adapter.log.debug(JSON.stringify({ id: id, type: type, uri: uri, payload: payload, prefix: prefix }));
        if (!this.isConnected || !this.isRegistered) {
            this.adapter.log.warn(`Device is offline or disconneted!!`);
            return;
        }
        if (type == "pointer") {
            void this.sendPointer(id, type, uri, payload, prefix);
        } else {
            this.sendCommand(type, uri, payload, id, prefix);
        }
    }

    /**
     * Wake on lan
     *
     * @param id ioBroker object id
     */
    public async wol(id: string): Promise<void> {
        if (this.ip && this.mac) {
            const val = await promisedWol(this.mac);
            if (val) {
                await this.adapter.setState(id, { ack: true });
                this.adapter.log.info(`Send wol: ${this.mac} - ${this.ip}`);
            } else {
                this.adapter.log.info(`Send wol error: ${val}`);
            }
            const address = await promisedWolAddress(this.mac, this.ip);
            if (address) {
                await this.adapter.setState(id, { ack: true });
                this.adapter.log.info(`Send wol address: ${this.mac} - ${this.ip}`);
            } else {
                this.adapter.log.info(`Send wol address error: ${address}`);
            }
        }
    }

    /**
     * Open Callback handling
     */
    private checkOpenMessage(): void {
        for (const id in this.v4) {
            const obj = this.v4.get(id);
            if (typeof obj === "object" && obj.callback) {
                this.sendObjCallback(obj, { error: "Message close!" });
                this.v4.delete(id);
            }
        }
    }

    /**
     * Sends a message direct
     *
     * @param obj Message
     */
    public async messageDirect(obj: ioBroker.Message): Promise<void> {
        if (!this.isConnected || !this.isRegistered) {
            this.sendObjCallback(obj, { error: "Device is offline or disconneted!" });
            return;
        }
        if (obj.message.name != "") {
            const ip = forbidden_ip(obj.message.name, this.adapter.FORBIDDEN_CHARS);
            if (ip == this.dp) {
                if (typeof obj.message.send === "string") {
                    if (obj.message.connection != "pointer") {
                        const resp = await this.sendDirectPromiseCommand(obj.message.send);
                        if (resp && obj.callback) {
                            this.sendObjCallback(obj, resp);
                        } else {
                            this.sendObjCallback(obj, { error: "Unknown error" });
                        }
                    } else if (obj.message.connection == "pointer") {
                        if (this.pointerWebSocket) {
                            this.pointerWebSocket.send(`${obj.message.send}\n\n`);
                            this.sendObjCallback(obj, { info: "Send message" });
                        } else {
                            this.sendObjCallback(obj, { info: "Cannot found websocket" });
                        }
                    } else if (obj.callback) {
                        this.sendObjCallback(obj, { error: "Missing type or uri" });
                    }
                } else {
                    this.sendObjCallback(obj, { error: "Wrong message" });
                }
            } else {
                this.sendObjCallback(obj, { error: "Wrong IP" });
            }
        } else {
            this.sendObjCallback(obj, { error: "Missing IP" });
        }
        this.checkCallback = this.adapter.setTimeout(() => {
            this.checkCallback = undefined;
            this.checkOpenMessage();
        }, 5 * 1000);
    }

    /**
     * Sends a message
     *
     * @param obj Message
     */
    public async message(obj: ioBroker.Message): Promise<void> {
        if (!this.isConnected || !this.isRegistered) {
            this.sendObjCallback(obj, { error: "Device is offline or disconneted!!!" });
            return;
        }
        if (obj.message.prefix == "luna://" && obj.message.type != "pointer") {
            if (obj.message.uri) {
                await this.sendLunaRequest(obj, obj.message.type, obj.message.uri, obj.message.payload);
            }
        } else if (obj.message.type && obj.message.uri && obj.message.type != "pointer") {
            this.sendCommand(obj.message.type, obj.message.uri, obj.message.payload, obj, obj.message.prefix);
        } else if (obj.message.type && obj.message.uri && obj.message.type == "pointer") {
            if (!this.pointerWebSocket) {
                const socketPath = await this.sendPromiseCommand("request", Endpoint.INPUT_SOCKET, null);
                if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
                    this.socketPath = socketPath.payload.socketPath;
                    this.openPointerRequest = {
                        type: obj.message.type,
                        uri: obj.message.uri,
                        payload: obj.message.payload,
                        first: obj,
                        prefix: obj.message.prefix,
                    };
                    this.startpointerWebSocket();
                }
            } else {
                this.sendCommand(obj.message.type, obj.message.uri, obj.message.payload, obj, obj.message.prefix);
                this.sendObjCallback(obj, { info: "Send button ok" });
            }
        } else if (obj.callback) {
            this.sendObjCallback(obj, { error: "Missing type or uri" });
            return;
        }
        this.checkCallback = this.adapter.setTimeout(() => {
            this.checkCallback = undefined;
            this.checkOpenMessage();
        }, 5 * 1000);
    }

    /**
     * Sends a Pointer message
     *
     * @param id ioBroker object id
     * @param type Message type
     * @param uri Endpoint
     * @param payload Payload data
     * @param prefix - URI prefix
     */
    private async sendPointer(
        id: string,
        type: string,
        uri?: string,
        payload?: any,
        prefix = `ssap://`,
    ): Promise<void> {
        if (!this.pointerWebSocket) {
            const socketPath = await this.sendPromiseCommand("request", Endpoint.INPUT_SOCKET, null);
            if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
                this.socketPath = socketPath.payload.socketPath;
                this.openPointerRequest = {
                    type: type,
                    uri: uri,
                    payload: payload,
                    first: id,
                    prefix: prefix,
                };
                this.startpointerWebSocket();
            }
        } else {
            this.sendCommand(type, uri, payload, id, prefix);
        }
    }

    /**
     * Sends a own message
     *
     * @param type Message type
     * @param uri Endpoint
     * @param payload Payload data
     * @param prefix - URI prefix
     */
    public async own_request(type: string, uri?: string, payload?: any, prefix = `ssap://`): Promise<void> {
        this.adapter.log.debug(JSON.stringify({ type: type, uri: uri, payload: payload, prefix: prefix }));
        if (prefix == "luna://" && type != "pointer") {
            if (uri) {
                await this.sendLunaRequest("Own", type, uri, payload);
            }
        } else if (type != "pointer") {
            this.sendCommand(type, uri, payload, "Own", prefix);
        } else {
            if (!this.pointerWebSocket) {
                const socketPath = await this.sendPromiseCommand("request", Endpoint.INPUT_SOCKET, null);
                if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
                    this.socketPath = socketPath.payload.socketPath;
                    this.openPointerRequest = {
                        type: type,
                        uri: uri,
                        payload: payload,
                        first: "Own",
                        prefix: prefix,
                    };
                    this.startpointerWebSocket();
                }
            } else {
                this.sendCommand(type, uri, payload, "Own", prefix);
            }
            const resp = {
                type: "response",
                id: "no id",
                payload: {
                    info: "Send button ok",
                },
            };
            await this.ownRequest(resp);
        }
    }

    /**
     * Sends a message
     *
     * @param type types
     * @param uri uri address
     * @param payload pairing
     * @param first first
     * @param prefix prefix
     * @returns boolean
     */
    private sendCommand(type: string, uri?: string, payload?: any, first?: any, prefix?: string): boolean {
        this.adapter.log.debug(
            `sendCommand: ${JSON.stringify({ type: type, uri: uri, payload: payload, first: first, prefix: prefix })}`,
        );
        // ToDo TURN_OFF_SCREEN & TURN_OFF_SCREEN_WO
        const id = type == "register" ? "register_0" : uuidv4();
        if (first == "First") {
            const responseRequest = {
                id: "",
                type: "",
                uri: "",
                response: "",
                error: "",
                errorCode: 0,
                errorText: "",
                settings: "No Value",
                subscribe: false,
                category: "No Value",
            };
            if (payload && payload.keys) {
                const available = this.getRespRequestFindSecond(uri ? uri : "", "uri", JSON.stringify(payload.keys));
                if (available && available[1]) {
                    this.removeRespCheckUuid(available[0]);
                }
                responseRequest.settings = payload.keys.toString();
                responseRequest.category = payload.category;
            } else {
                const available = this.getRespRequestFind(uri ? uri : "", "uri");
                if (available && available[1]) {
                    this.removeRespCheckUuid(available[0]);
                }
            }
            responseRequest.id = id;
            responseRequest.type = type;
            responseRequest.uri = uri ? uri : "";
            this.reqResp.push([id, responseRequest]);
        }
        this.v4.set(id, type);
        if (uri) {
            this.v4.set(id, uri);
        }
        if (first && type != "pointer") {
            this.v4.set(id, first);
        }
        if (this.ws == null) {
            this.adapter.log.error(`Cannot found web socket!!!`);
            return false;
        }
        if (prefix == null) {
            prefix = "ssap://"; // luna://
        }

        const uri_complete = uri == null ? prefix : prefix + uri;
        if (prefix == "luna://" && type != "pointer") {
            void this.sendLunaRequest(first, type, uri_complete, payload);
            this.v4.delete(id);
        } else if (prefix == "luna://" && !this.luna) {
            void this.sendLunaRequest(first, type, uri_complete, payload);
            this.v4.delete(id);
        } else if (type == "unsubscribe" || type == "subscribe" || type == "request" || type == "register") {
            this.adapter.log.debug(
                `Send Request with id ${id}, uri ${uri_complete} and request ${JSON.stringify(payload)}`,
            );
            this.ws.send(
                JSON.stringify({
                    id: id,
                    type: type,
                    uri: uri_complete,
                    payload: payload,
                }),
            );
        } else if (
            type == "pointer" &&
            typeof payload === "object" &&
            this.pointerWebSocket &&
            this.isPointerConnected
        ) {
            const message = Object.keys(payload)
                .reduce(
                    (all, param) => {
                        return all.concat([`${param}:${payload[param]}`]);
                    },
                    [`type:${uri_complete}`],
                )
                .join("\n");
            this.adapter.log.debug(`Send Request with id ${id}, uri ${uri_complete} and request ${message}\n\n`);
            this.pointerWebSocket.send(`${message}\n\n`);
            this.v4.delete(id);
            this.getPointerCheck();
            if (typeof first === "string" && this.dp != undefined && first.includes(this.dp)) {
                void this.setAckFlag(first);
            }
        } else {
            this.adapter.log.error(`Unknown request ${JSON.stringify(payload)} - ${type} - ${uri}`);
        }
        return true;
    }

    /**
     * Sends a Luna message (this is a workaround)
     *
     * @param first - Object Id or message obj
     * @param type - Request type
     * @param uri - uri address
     * @param params - Payload
     */
    private async sendLunaRequest(first: any, type: string, uri: string, params: any): Promise<void> {
        this.adapter.log.debug(
            `Send Luna Request with id ${first}, type ${type}, uri ${uri} and request ${JSON.stringify(params)}`,
        );

        const buttons = [{ label: "", onClick: uri, params: params }];
        const payload = {
            message: "Update settings!",
            buttons: buttons,
            onclose: { uri: uri, params: params },
            onfail: { uri: uri, params: params },
        };
        const messageId = await this.sendPromiseCommand("request", Endpoint.CREATE_ALERT, payload);
        if (first == "Own") {
            void this.ownRequest(messageId);
        }
        if (messageId && messageId.id) {
            if (this.v4.get(messageId.id)) {
                this.v4.delete(messageId.id);
            }
        }
        if (messageId && messageId.payload && messageId.payload.alertId) {
            const resp = await this.sendPromiseCommand("request", Endpoint.CLOSE_ALERT, {
                alertId: messageId.payload.alertId,
            });
            if (first == "Own") {
                void this.ownRequest(resp);
            }
            this.adapter.log.debug(`Response Alert Luna ${JSON.stringify(resp)}`);
            if (resp && resp.id) {
                if (this.v4.get(resp.id)) {
                    this.v4.delete(resp.id);
                }
            }
            if (resp && resp.payload && resp.payload.returnValue) {
                if (typeof first === "string" && this.dp != undefined && first.includes(this.dp)) {
                    void this.setAckFlag(first);
                }
            }
        }
        if (typeof first == "object" && first.callback) {
            this.adapter.sendTo(first.from, first.command, messageId, first.callback);
        }
    }

    /**
     * Sends a message with promise response
     *
     * @param type Type
     * @param uri URI
     * @param payload Payload
     * @param prefix Prefix
     * @returns Response
     */
    private async sendPromiseCommand(
        type: string,
        uri?: string,
        payload?: any,
        prefix = `ssap://`,
    ): Promise<LGResponse> {
        return new Promise((resolve, reject) => {
            if (!this.isConnected || !this.isRegistered) {
                reject;
            }
            const id = uuidv4();
            this.v4.set(id, "PromiseResponse");
            const listener = (event: MessageEvent): any => {
                try {
                    const json: LGResponse = JSON.parse(event.data.toString());
                    if (json.id && json.id === id) {
                        this.ws?.removeEventListener("message", listener);
                        return resolve(json);
                    }
                } catch {
                    this.v4.delete(id);
                    return reject;
                }
            };
            this.ws?.addEventListener("message", listener);
            this.ws?.send(
                JSON.stringify({
                    id,
                    type,
                    uri: `${prefix}${uri}`,
                    payload,
                }),
            );
            this.adapter.setTimeout(() => {
                this.ws?.removeEventListener("message", listener);
                this.v4.delete(id);
                reject;
            }, 1000 * 5);
        });
    }

    /**
     * Sends a message with promise response
     *
     * @param payload Payload
     * @returns Response
     */
    private async sendDirectPromiseCommand(payload: string): Promise<LGResponse> {
        return new Promise((resolve, reject) => {
            if (!this.isConnected || !this.isRegistered) {
                reject;
            }
            let val: any;
            try {
                val = JSON.parse(payload);
            } catch {
                reject;
            }
            const listener = (event: MessageEvent): any => {
                try {
                    const json: LGResponse = JSON.parse(event.data.toString());
                    if (json.id && json.id === val.id) {
                        this.ws?.removeEventListener("message", listener);
                        return resolve(json);
                    } else if (json.type == "error") {
                        return resolve(json);
                    }
                } catch {
                    return reject;
                }
            };
            this.ws?.addEventListener("message", listener);
            this.ws?.send(JSON.stringify(payload));
            this.adapter.setTimeout(() => {
                this.ws?.removeEventListener("message", listener);
                reject;
            }, 1000 * 5);
        });
    }

    /**
     * Sleep
     *
     * @param ms milliseconds
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => {
            this.delayTimeout = this.adapter.setTimeout(resolve, ms);
        });
    }

    /**
     * Actived MDNS Log
     */
    public mdnLog(val: boolean): void {
        this.adapter.log.debug(`MDN Log: ${val}`);
        this.log = val;
    }

    /**
     * Set ack flag
     *
     * @param id ioBroker object id
     */
    private async setAckFlag(id: string): Promise<void> {
        await this.adapter.setState(id, { ack: true });
    }

    /**
     * Check response error or response
     *
     * @param val find string
     * @param key key
     * @returns [string, respCheck] | undefined
     */
    private getRespRequestFind(val: string, key: "id" | "uri" | "settings"): [string, respCheck] | undefined {
        const entry = this.reqResp.find(r => r[1][key] === val);
        if (entry) {
            return entry;
        }
        return undefined;
    }

    /**
     * Check response error or response
     *
     * @param val find string
     * @param key key
     * @param valSecond find string
     * @returns [string, respCheck] | undefined
     */
    private getRespRequestFindSecond(
        val: string,
        key: "id" | "uri" | "settings",
        valSecond: string,
    ): [string, respCheck] | undefined {
        const entry = this.reqResp.find(r => r[1][key] === val && r[1].settings === valSecond);
        if (entry) {
            return entry;
        }
        return undefined;
    }

    /**
     * Find request with 32Bits URI
     *
     * @param key V4 UUID
     * @returns [string, respCheck] | undefined
     */
    private getRespRequestKeyFind(key: string): [string, respCheck] | undefined {
        const entry = this.reqResp.find(r => r[0] === key);
        if (entry) {
            return entry;
        }
        return undefined;
    }

    /**
     * Remove request
     *
     * @param uuid V4 UUID
     */
    private removeRespCheckUuid(uuid: string): void {
        this.reqResp = this.reqResp.filter(r => r[0] !== uuid);
    }

    /**
     * Set response value
     *
     * @param resp TV Response
     */
    private setResponseValue(resp: LGResponse): void {
        if (!resp.id) {
            this.adapter.log.error(`Unknown error: ${JSON.stringify(resp)}`);
            return;
        }
        const entry = this.getRespRequestKeyFind(resp.id);
        if (entry && entry[1] != null) {
            entry[1].response = resp.type;
            if (resp.type == "error") {
                entry[1].error = resp.error ? resp.error : "Unknown error";
                if (resp.payload && resp.payload.errorCode != undefined) {
                    entry[1].errorCode = resp.payload.errorCode;
                }
                if (resp.payload && resp.payload.errorText != undefined) {
                    entry[1].errorText = resp.payload.errorText;
                }
            } else if (resp.type == "response") {
                if (resp.payload && resp.payload.subscribed) {
                    entry[1].subscribe = resp.payload.subscribed;
                }
            }
        }
    }

    /**
     * Destroy all events
     */
    public async destroy(): Promise<void> {
        if (this.mdn != null) {
            this.mdn.destroy();
            this.mdn = null;
        }
        if (this.ws != null) {
            this.ws.close();
            this.ws = null;
        }
        if (this.pointerWebSocket != null) {
            this.pointerWebSocket.close();
            this.pointerWebSocket = null;
        }
        this.checkOpenMessage();
        this.v4.clear();
        this.checkCallback && this.adapter.clearTimeout(this.checkCallback);
        this.delayTimeout && this.adapter.clearTimeout(this.delayTimeout);
        this.subscribeChannel && this.adapter.clearTimeout(this.subscribeChannel);
        this.pointerCheck && this.adapter.clearTimeout(this.pointerCheck);
        this.checkTVStatus && this.adapter.clearInterval(this.checkTVStatus);
        this.startWebSocketDelay && this.adapter.clearTimeout(this.startWebSocketDelay);
        await this.updateStatus(false);
        await this.updatePointerStatus(false);
    }
}
