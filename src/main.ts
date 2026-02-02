/*
 * Created with @iobroker/create-adapter v3.1.2
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { TVHandler } from "./api/device";
import { Endpoint, forbidden_ip } from "./api/helper";
import type { Status } from "./types/device";

class LgWebos extends utils.Adapter {
    private devices: Map<string, TVHandler> = new Map<string, TVHandler>();
    private oldDevice: Map<string, TVHandler> = new Map<string, TVHandler>();
    private picture: Map<string, TVHandler> = new Map<string, TVHandler>();
    private devicesStatus: Status[] = [];
    private connection: boolean;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "lg-webos",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.connection = false;
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        await this.setState("info.connection", false, true);
        if (this.config.devices && typeof this.config.devices === "object" && this.config.devices.length > 0) {
            for (const dev of this.config.devices) {
                if (dev.active) {
                    if (dev.ip != "") {
                        dev.dp = forbidden_ip(dev.ip, this.FORBIDDEN_CHARS);
                        if (dev.Interval < 0 || dev.Interval > 1440) {
                            dev.Interval = 0;
                        }
                        const devObj = Object.assign({}, dev);
                        this.devicesStatus.push({ ip: dev.dp, status: false });
                        this.devices.set(dev.dp, new TVHandler(this, devObj));
                        this.devices.get(dev.dp)?.on("update", this.getUpdateData.bind(this));
                        this.oldDevice.set(dev.dp, dev.oldDevice);
                        this.picture.set(dev.dp, dev.picture);
                    } else {
                        this.log.info(`Missing IP from ${dev.tvname}!`);
                    }
                } else {
                    this.log.info(`Device ${dev.tvname} is disabled!`);
                }
            }
        } else {
            this.log.info(`Please create a TV in the instance settings!`);
        }
        await this.checkDeviceFolder();
        this.subscribeStates("*");
    }

    /**
     * checkDeviceFolder
     */
    private async checkDeviceFolder(): Promise<void> {
        try {
            this.log.info(`Start check devices object!`);
            const devices = await this.getDevicesAsync();
            for (const element of devices) {
                const id = element._id.split(".").pop();
                const device = this.config.devices.find(dev => dev.dp === id);
                if (device !== -1) {
                    this.log.debug(`Found device ${element._id}`);
                } else {
                    this.log.info(`Delete device ${element._id}`);
                    await this.delObjectAsync(`${id}`, { recursive: true });
                }
            }
        } catch (error: unknown) {
            if (typeof error === "string") {
                this.log.error(`checkDeviceFolder: ${error}`);
            } else if (error instanceof Error) {
                this.log.error(`checkDeviceFolder: ${error.name}: ${error.message}`);
            }
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback - Callback function
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            for (const id in this.devices.keys()) {
                await this.devices.get(id)?.destroy();
            }
            callback();
        } catch (error) {
            this.log.error(`Error during unloading: ${(error as Error).message}`);
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     *
     * @param id - State ID
     * @param state - State object
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state && !state.ack) {
            const idParts = id.split(".");
            const command = idParts.pop();
            const deviceId = id.split(".")[2];
            if (!this.devices.get(deviceId)) {
                this.log.error(`Device ${deviceId} is disabled`);
                return;
            }
            let digit = "0";
            const settings: any = {};
            let level: any = {};
            let system = Endpoint.LUNA_SET_SYSTEM_SETTINGS;
            let method = "luna://";
            switch (command) {
                case "rewind":
                case "fastForward":
                case "exit":
                case "home":
                case "red":
                case "green":
                case "yellow":
                case "blue":
                case "play":
                case "pause":
                case "stop":
                case "back":
                case "menu":
                case "cc":
                case "asterisk":
                case "dash":
                case "up":
                case "left":
                case "right":
                case "down":
                    this.devices
                        .get(deviceId)
                        ?.request(id, "pointer", Endpoint.SET_BUTTON, { name: command.toString().toUpperCase() }, "");
                    break;
                case "digit0":
                case "digit1":
                case "digit2":
                case "digit3":
                case "digit4":
                case "digit5":
                case "digit6":
                case "digit7":
                case "digit8":
                case "digit9":
                    digit = command.charAt(command.length - 1);
                    this.devices.get(deviceId)?.request(id, "pointer", Endpoint.SET_BUTTON, { name: digit }, "");
                    break;
                case "enter":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.SEND_ENTER);
                    break;
                case "mute":
                    this.devices
                        .get(deviceId)
                        ?.request(id, "request", Endpoint.SET_MUTE, { mute: state.val ? true : false });
                    break;
                case "channelDown":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.TV_CHANNEL_DOWN);
                    break;
                case "channelUp":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.TV_CHANNEL_UP);
                    break;
                case "volumeUp":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.VOLUME_UP);
                    break;
                case "volumeDown":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.VOLUME_DOWN);
                    break;
                case "rtlPlus":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "com.netrtl.tvnow",
                        });
                    }
                    break;
                case "disneyPlus":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "com.disney.disneyplus-prod",
                        });
                    }
                    break;
                case "youtube":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "youtube.leanback.v4",
                        });
                    }
                    break;
                case "appletv":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "com.apple.appletv",
                        });
                    }
                    break;
                case "netflix":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "netflix",
                        });
                    }
                    break;
                case "amazon":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "amazon",
                        });
                    }
                    break;
                case "amazonAlexa":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "amazon.alexa.view",
                        });
                    }
                    break;
                case "joyn":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: "joyn",
                        });
                    }
                    break;
                case "openURL":
                    if (typeof state.val === "string" && state.val != null && state.val != "") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.OPEN, {
                            target: state.val,
                        });
                    }
                    break;
                case "3Dmode":
                    if (state.val) {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.SET_3D_ON);
                    } else {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.SET_3D_OFF);
                    }
                    break;
                case "channel":
                    if (typeof state.val === "number" && state.val != null) {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.SET_CHANNEL, {
                            channelNumber: state.val.toString(),
                        });
                    }
                    break;
                case "channelId":
                    if (typeof state.val === "string" && state.val != null) {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.SET_CHANNEL, {
                            channelId: state.val,
                        });
                    }
                    break;
                case "input":
                case "launch":
                    if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCH, {
                            id: state.val,
                        });
                    }
                    break;
                case "soundOutput":
                    this.devices
                        .get(deviceId)
                        ?.request(id, "request", Endpoint.CHANGE_SOUND_OUTPUT, { output: state.val });
                    break;
                case "volume":
                    if (typeof state.val === "number" && state.val != null && state.val >= 0 && state.val <= 100) {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.SET_VOLUME, { volume: state.val });
                    }
                    break;
                case "powerOff":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.POWER_OFF);
                    break;
                case "powerOn":
                    void this.devices.get(deviceId)?.wol(id);
                    break;
                case "screenOff":
                    level = Endpoint.TURN_OFF_SCREEN;
                    if (this.oldDevice.get(deviceId)) {
                        level = Endpoint.TURN_OFF_SCREEN_OD;
                    }
                    this.devices.get(deviceId)?.request(id, "request", level, { standbyMode: "active" });
                    break;
                case "screenOn":
                    level = Endpoint.TURN_ON_SCREEN;
                    if (this.oldDevice.get(deviceId)) {
                        level = Endpoint.TURN_ON_SCREEN_OD;
                    }
                    this.devices.get(deviceId)?.request(id, "request", level, { standbyMode: "active" });
                    break;
                case "closeAlert":
                    if (state.val != null && state.val != "no") {
                        void this.devices
                            .get(deviceId)
                            ?.MessageHandler(id, "closeAlert", Endpoint.CLOSE_ALERT, { alertId: state.val });
                    }
                    break;
                case "createAlert":
                    void this.devices.get(deviceId)?.MessageHandler(id, "createAlert", Endpoint.CREATE_ALERT, {
                        message: state.val,
                        buttons: [{ label: "OK" }],
                    });
                    break;
                case "closeToast":
                    if (state.val != null && state.val != "no") {
                        void this.devices
                            .get(deviceId)
                            ?.MessageHandler(id, "closeToast", Endpoint.CLOSE_TOAST, { toastId: state.val });
                    }
                    //data = base64(content)
                    //data = {"iconData": data, "iconExtension": "png", "message": message}
                    break;
                case "createToast":
                    void this.devices
                        .get(deviceId)
                        ?.MessageHandler(id, "createToast", Endpoint.CREATE_TOAST, { message: state.val });
                    break;
                case "request":
                    this.own_request(deviceId, state);
                    break;
                case "click":
                    this.devices.get(deviceId)?.request(id, "pointer", Endpoint.CURSOR_CLICK, null, "");
                    break;
                case "drag":
                    if (state.val && ~state.val.toString().indexOf(",")) {
                        const vals = state.val.toString().split(",");
                        const dx = parseInt(vals[0]);
                        const dy = parseInt(vals[1]);
                        const drag = vals[2] == "drag" ? 1 : 0;
                        this.devices.get(deviceId)?.request(
                            id,
                            "pointer",
                            Endpoint.CURSOR_DRAG,
                            {
                                dx: dx,
                                dy: dy,
                                drag: drag,
                            },
                            "",
                        );
                    }
                    break;
                case "scroll":
                    if (state.val && ~state.val.toString().indexOf(",")) {
                        const vals = state.val.toString().split(",");
                        const dx = parseInt(vals[0]);
                        const dy = parseInt(vals[1]);
                        this.devices
                            .get(deviceId)
                            ?.request(id, "pointer", Endpoint.CURSOR_SCROLL, { dx: dx, dy: dy }, "");
                    }
                    break;
                case "mdnLog":
                    if (state.val != null && typeof state.val === "boolean") {
                        this.devices.get(deviceId)?.mdnLog(state.val);
                    }
                    break;
                case "deleteText":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.SEND_DELETE);
                    break;
                case "insertText":
                    if (state.val != null && typeof state.val === "string") {
                        this.devices.get(deviceId)?.request(id, "request", Endpoint.INSERT_TEXT, { text: state.val });
                    }
                    break;
                case "closeLaunch":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.LAUNCHER_CLOSE);
                    break;
                case "screenshot":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.TAKE_SCREENSHOT);
                    break;
                case "closeWebApp":
                    this.devices.get(deviceId)?.request(id, "request", Endpoint.CLOSE_WEB_APP);
                    break;
                case "screenSaver":
                    this.devices
                        .get(deviceId)
                        ?.request(id, "request", Endpoint.LUNA_TURN_ON_SCREEN_SAVER, {}, "luna://");
                    break;
                case "showInputPicker":
                    this.devices
                        .get(deviceId)
                        ?.request(id, "request", Endpoint.LUNA_SHOW_INPUT_PICKER, null, "luna://");
                    break;
                case "brightness":
                case "backlight":
                case "contrast":
                case "color":
                case "sharpness":
                case "tint":
                    settings[command] = state.val?.toString();
                    if (this.picture.get(deviceId)) {
                        system = Endpoint.SET_SYSTEM_SETTINGS;
                        method = "ssap://";
                    }
                    this.devices.get(deviceId)?.request(
                        id,
                        "request",
                        system,
                        {
                            category: "picture",
                            settings: settings,
                        },
                        method,
                    );
                    break;
                case "pictureMode":
                case "energySaving":
                case "dynamicContrast":
                case "peakBrightness":
                case "gamma":
                case "colorGamut":
                case "hdrDynamicToneMapping":
                case "noiseReduction":
                case "dynamicColor":
                case "smoothGradation":
                case "mpegNoiseReduction":
                    settings[command] = state.val;
                    if (this.picture.get(deviceId)) {
                        system = Endpoint.SET_SYSTEM_SETTINGS;
                        method = "ssap://";
                    }
                    this.devices.get(deviceId)?.request(
                        id,
                        "request",
                        system,
                        {
                            category: "picture",
                            settings: settings,
                        },
                        method,
                    );
                    break;
                case "motionEyeCare":
                case "realCinema":
                case "eyeComfortMode":
                    settings[command] = state.val ? "on" : "off";
                    if (this.picture.get(deviceId)) {
                        system = Endpoint.SET_SYSTEM_SETTINGS;
                        method = "ssap://";
                    }
                    this.devices.get(deviceId)?.request(
                        id,
                        "request",
                        system,
                        {
                            category: "picture",
                            settings: settings,
                        },
                        method,
                    );
                    break;
                case "blackLevel":
                    if (typeof state.val === "string" && state.val.startsWith("{")) {
                        try {
                            level = JSON.parse(state.val);
                            if (this.picture.get(deviceId)) {
                                system = Endpoint.SET_SYSTEM_SETTINGS;
                                method = "ssap://";
                            }
                            this.devices.get(deviceId)?.request(
                                id,
                                "request",
                                system,
                                {
                                    category: "picture",
                                    settings: { blackLevel: level },
                                },
                                method,
                            );
                        } catch (error: unknown) {
                            if (typeof error === "string") {
                                this.log.error(error);
                            } else if (error instanceof Error) {
                                this.log.error(`${error.name}: ${error.message}`);
                            }
                        }
                    }
                    break;
                case "deviceName":
                    if (this.picture.get(deviceId)) {
                        system = Endpoint.SET_SYSTEM_SETTINGS;
                        method = "ssap://";
                    }
                    this.devices.get(deviceId)?.request(
                        id,
                        "request",
                        system,
                        {
                            category: "network",
                            settings: { deviceName: state.val },
                        },
                        method,
                    );
                    break;
                case "wolwowlOnOff":
                    if (this.picture.get(deviceId)) {
                        system = Endpoint.SET_SYSTEM_SETTINGS;
                        method = "ssap://";
                    }
                    this.devices.get(deviceId)?.request(
                        id,
                        "request",
                        system,
                        {
                            category: "network",
                            settings: { wolwowlOnOff: state.val ? "true" : "false" },
                        },
                        method,
                    );
                    break;
                default:
                    this.log.warn(`Cannot found command ${command} from device ${deviceId}`);
            }
        }
    }

    /**
     * Own request
     *
     * @param deviceId - State ID
     * @param state - State object
     */
    private own_request(deviceId: string, state: ioBroker.State | null | undefined): void {
        if (state && state.val && typeof state.val === "string" && state.val.startsWith("{")) {
            const json = JSON.parse(state.val);
            if (json.type) {
                void this.devices.get(deviceId)?.own_request(json.type, json.uri, json.payload, json.prefix);
            }
        }
    }

    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.messagebox" property to be set to true in io-package.json
     *
     * @param obj ioBroker.Message
     */
    private onMessage(obj: ioBroker.Message): void {
        if (typeof obj === "object" && obj.message) {
            if (obj.command === "sendTV" || obj.command === "sendData") {
                if (obj.message.name) {
                    if (obj.message.name === "all") {
                        // ToDo create array response - e.g. for toastId or alertId
                        if (obj.callback) {
                            this.sendTo(
                                obj.from,
                                obj.command,
                                { error: "Multi callback is not possible!" },
                                obj.callback,
                            );
                        }
                        obj.message.all = true;
                        for (const id in this.devices.keys()) {
                            void this.devices.get(id)?.message(obj);
                        }
                    } else {
                        const ip = forbidden_ip(obj.message.name, this.FORBIDDEN_CHARS);
                        obj.message.all = false;
                        void this.devices.get(ip)?.message(obj);
                    }
                } else {
                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, { error: "Missing object Id" }, obj.callback);
                    }
                }
            } else if (obj.command === "sendDirect") {
                if (obj.message.name === "all") {
                    // ToDo create array response - e.g. for toastId or alertId
                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, { error: "Multi callback is not possible!" }, obj.callback);
                    }
                    obj.message.all = true;
                    for (const id in this.devices.keys()) {
                        void this.devices.get(id)?.messageDirect(obj);
                    }
                } else {
                    const ip = forbidden_ip(obj.message.name, this.FORBIDDEN_CHARS);
                    obj.message.all = false;
                    void this.devices.get(ip)?.messageDirect(obj);
                }
            } else {
                if (obj.callback) {
                    this.sendTo(obj.from, obj.command, { error: "Message unknown" }, obj.callback);
                }
            }
        }
    }

    /**
     * Own request
     *
     * @param ip - State ID
     * @param data - status
     */
    private async getUpdateData(ip: string, data: boolean): Promise<void> {
        this.log.debug(ip);
        this.log.debug(JSON.stringify(data));
        const device = this.devicesStatus.find((dev: Status) => dev.ip === ip);
        if (device) {
            device.status = data;
        }
        const status = this.devicesStatus.find((dev: Status) => dev.status);
        let val = false;
        if (status) {
            val = true;
        }
        if (this.connection != val) {
            this.connection = val;
            await this.setState("info.connection", val, true);
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new LgWebos(options);
} else {
    // otherwise start the instance directly
    (() => new LgWebos())();
}
