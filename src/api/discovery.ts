import { Buffer } from "node:buffer";
import dgram from "node:dgram";
import { EventEmitter } from "node:events";
import type { Discovery } from "../types/discovery";

/**
 * @param iob ioBroker.Adapter
 */
export class lgtv_discovery extends EventEmitter implements Discovery {
    private ssdp_ip: string;
    private ssdp_port: number;
    private ssdp_msg: string;
    private ssdp_socket: any;
    private adapter: ioBroker.Adapter;
    private message: Buffer;
    private sendTimeout: ioBroker.Timeout | undefined;
    private log: boolean;

    /**
     * LG Discovery
     *
     * @param iob iobroker ulits
     */
    constructor(iob: ioBroker.Adapter) {
        super();
        this.adapter = iob;
        this.ssdp_ip = "239.255.255.250";
        this.ssdp_port = 1900;
        this.sendTimeout = undefined;
        this.ssdp_msg = `M-SEARCH * HTTP/1.1\r\n`;
        this.ssdp_msg += `HOST: <ip>:<port>\r\n`;
        this.ssdp_msg += `MAN: "ssdp:discover"\r\n`;
        this.ssdp_msg += `MX: 5\r\n`;
        this.ssdp_msg += `ST: urn:dial-multiscreen-org:service:dial:1\r\n`;
        this.ssdp_msg += `USER-AGENT: ioBroker\r\n\r\n`;
        this.ssdp_msg = this.ssdp_msg.replace("<ip>", this.ssdp_ip);
        this.ssdp_msg = this.ssdp_msg.replace("<port>", this.ssdp_port.toString());
        this.message = Buffer.from(this.ssdp_msg);
        this.log = false;
    }

    /**
     * Change Message
     *
     * @param msg Message
     */
    public setMsg(msg: string): void {
        this.ssdp_msg = msg;
        msg = msg.replace("<port>", this.ssdp_port.toString());
        msg = msg.replace("<ip>", this.ssdp_ip);
        this.message = Buffer.from(msg);
    }

    /**
     * Change IP
     *
     * @param ip IP
     */
    public setIp(ip: string): void {
        let msg = this.ssdp_msg;
        msg = msg.replace("<port>", this.ssdp_port.toString());
        msg = msg.replace("<ip>", ip);
        this.message = Buffer.from(msg);
    }

    /**
     * Change Port
     *
     * @param port Port
     */
    public setPort(port: string): void {
        let msg = this.ssdp_msg;
        msg = msg.replace("<port>", port);
        msg = msg.replace("<ip>", this.ssdp_ip);
        this.message = Buffer.from(msg);
    }

    /**
     * Set SSDP Data
     *
     * @param dp Object Device
     */
    public async setData(dp: string): Promise<void> {
        const msg = await this.adapter.getStateAsync(`${dp}.status.ssdp_msg`);
        const ip = await this.adapter.getStateAsync(`${dp}.status.ssdp_ip`);
        const port = await this.adapter.getStateAsync(`${dp}.status.ssdp_port`);
        if (msg && msg.val && typeof msg.val === "string") {
            this.ssdp_msg = msg.val;
            let ssdp_msg = msg.val;
            if (ip && ip.val && typeof ip.val === "string") {
                ssdp_msg = ssdp_msg.replace("<ip>", ip.val);
                this.ssdp_ip = ip.val;
            } else {
                ssdp_msg = ssdp_msg.replace("<ip>", this.ssdp_ip);
            }
            if (port && port.val && typeof port.val === "number") {
                ssdp_msg = ssdp_msg.replace("<port>", port.val.toString());
                this.ssdp_port = port.val;
            } else {
                ssdp_msg = ssdp_msg.replace("<port>", this.ssdp_port.toString());
            }
            this.message = Buffer.from(ssdp_msg);
        }
    }

    /**
     * Send SSDP Discovery Message
     */
    private _send_ssdp_discover(): void {
        if (!this.ssdp_socket) {
            this.adapter.log.error(`Discover sspd socket not open!!!`);
            this.emit("update", "socket");
        } else {
            this.ssdp_socket.send(
                this.message,
                0,
                this.message.length,
                this.ssdp_port,
                this.ssdp_ip,
                (error: unknown) => {
                    this.ssdp_socket.close();
                    this.emit("update", "sendError");
                    if (typeof error === "string") {
                        this.adapter.log.error(`discovery: ${error}`);
                    } else if (error instanceof Error) {
                        this.adapter.log.error(`discovery: ${error.name}: ${error.message}`);
                    }
                    this.ssdp_socket = undefined;
                },
            );
        }
    }

    /**
     * Start watching
     *
     * @param ip Device IP
     */
    public discovery(ip: string): void {
        this.ssdp_socket = dgram.createSocket("udp4");
        this.ssdp_socket.on("listening", () => {
            this._send_ssdp_discover();
        });
        this.ssdp_socket.on("message", (message: any, remote: { address: null }) => {
            if (this.log) {
                this.adapter.log.debug(`Address: ${remote.address}`);
                this.adapter.log.debug(message);
            }
            if (remote.address == ip) {
                this.emit("update", "found");
            }
            this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
            this.sendTimeout = this.adapter.setTimeout(() => {
                this.sendTimeout = undefined;
                this._send_ssdp_discover();
            }, 5 * 1000);
        });
        this.ssdp_socket.on("listening", () => {
            const address = this.ssdp_socket.address();
            this.adapter.log.debug(`server listening ${address.address}:${address.port}`);
        });
        this.ssdp_socket.on("close", () => {
            console.log("Socket closed successfully.");
            this.emit("update", "close");
        });
        this.ssdp_socket.on("connect", () => {
            console.log("Socket connected successfully.");
            this.emit("update", "connect");
        });
        this.ssdp_socket.on("error", (error: unknown) => {
            this.emit("update", "error");
            if (typeof error === "string") {
                this.adapter.log.error(`discovery: ${error}`);
            } else if (error instanceof Error) {
                this.adapter.log.error(`discovery: ${error.name}: ${error.message}`);
            }
            this.ssdp_socket.close();
            this.ssdp_socket = undefined;
        });
        this.ssdp_socket.bind();
    }

    /**
     * Actived MDNS Log
     */
    public mdnLog(val: boolean): void {
        this.adapter.log.debug(`MDN Log: ${val}`);
        this.log = val;
    }

    /**
     * destroy
     */
    public destroy(): void {
        this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
        if (this.ssdp_socket) {
            this.ssdp_socket.close();
            this.ssdp_socket = undefined;
        }
    }
}
