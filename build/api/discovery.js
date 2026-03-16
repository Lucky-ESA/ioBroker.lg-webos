"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var discovery_exports = {};
__export(discovery_exports, {
  lgtv_discovery: () => lgtv_discovery
});
module.exports = __toCommonJS(discovery_exports);
var import_node_buffer = require("node:buffer");
var import_node_dgram = __toESM(require("node:dgram"));
var import_node_events = require("node:events");
class lgtv_discovery extends import_node_events.EventEmitter {
  ssdp_ip;
  ssdp_port;
  ssdp_msg;
  ssdp_socket;
  adapter;
  message;
  sendTimeout;
  log;
  /**
   * LG Discovery
   *
   * @param iob iobroker ulits
   */
  constructor(iob) {
    super();
    this.adapter = iob;
    this.ssdp_ip = "239.255.255.250";
    this.ssdp_port = 1900;
    this.sendTimeout = void 0;
    this.ssdp_msg = `M-SEARCH * HTTP/1.1\r
`;
    this.ssdp_msg += `HOST: <ip>:<port>\r
`;
    this.ssdp_msg += `MAN: "ssdp:discover"\r
`;
    this.ssdp_msg += `MX: 5\r
`;
    this.ssdp_msg += `ST: urn:dial-multiscreen-org:service:dial:1\r
`;
    this.ssdp_msg += `USER-AGENT: ioBroker\r
\r
`;
    this.ssdp_msg = this.ssdp_msg.replace("<ip>", this.ssdp_ip);
    this.ssdp_msg = this.ssdp_msg.replace("<port>", this.ssdp_port.toString());
    this.message = import_node_buffer.Buffer.from(this.ssdp_msg);
    this.log = false;
  }
  /**
   * Change Message
   *
   * @param msg Message
   */
  setMsg(msg) {
    this.ssdp_msg = msg;
    msg = msg.replace("<port>", this.ssdp_port.toString());
    msg = msg.replace("<ip>", this.ssdp_ip);
    this.message = import_node_buffer.Buffer.from(msg);
  }
  /**
   * Change IP
   *
   * @param ip IP
   */
  setIp(ip) {
    let msg = this.ssdp_msg;
    msg = msg.replace("<port>", this.ssdp_port.toString());
    msg = msg.replace("<ip>", ip);
    this.message = import_node_buffer.Buffer.from(msg);
  }
  /**
   * Change Port
   *
   * @param port Port
   */
  setPort(port) {
    let msg = this.ssdp_msg;
    msg = msg.replace("<port>", port);
    msg = msg.replace("<ip>", this.ssdp_ip);
    this.message = import_node_buffer.Buffer.from(msg);
  }
  /**
   * Set SSDP Data
   *
   * @param dp Object Device
   */
  async setData(dp) {
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
      this.adapter.log.debug(`Data: ${ssdp_msg}`);
      this.message = import_node_buffer.Buffer.from(ssdp_msg);
    }
  }
  /**
   * Send SSDP Discovery Message
   */
  _send_ssdp_discover() {
    if (!this.ssdp_socket) {
      this.adapter.log.error(`Discover sspd socket not open!!!`);
      this.emit("update", "socket");
    } else {
      this.adapter.log.debug(`IP: ${this.ssdp_ip}`);
      this.adapter.log.debug(`PORT: ${this.ssdp_port}`);
      this.adapter.log.debug(`Message: ${this.message.toString()}`);
      this.ssdp_socket.send(this.message, 0, this.message.length, this.ssdp_port, this.ssdp_ip);
    }
  }
  /**
   * Start watching
   *
   * @param ip Device IP
   */
  discovery(ip) {
    this.ssdp_socket = import_node_dgram.default.createSocket("udp4");
    this.ssdp_socket.on("listening", () => {
      const address = this.ssdp_socket.address();
      this.adapter.log.debug(`server listening ${address.address}:${address.port}`);
      this._send_ssdp_discover();
    });
    this.ssdp_socket.on("message", (message, remote) => {
      if (this.log) {
        this.adapter.log.debug(`Address: ${remote.address}`);
        this.adapter.log.debug(message);
      }
      if (remote.address == ip) {
        this.emit("update", "found");
      }
      this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
      this.sendTimeout = this.adapter.setTimeout(() => {
        this.sendTimeout = void 0;
        this._send_ssdp_discover();
      }, 5 * 1e3);
    });
    this.ssdp_socket.on("close", () => {
      this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
      this.ssdp_socket = void 0;
      console.log("Socket closed successfully.");
      this.emit("update", "close");
    });
    this.ssdp_socket.on("connect", () => {
      console.log("Socket connected successfully.");
      this.emit("update", "connect");
    });
    this.ssdp_socket.on("error", (error) => {
      this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
      if (typeof error === "string") {
        this.adapter.log.error(`discovery 1: ${error}`);
      } else if (error instanceof Error) {
        this.adapter.log.error(`discovery 2: ${error.name}: ${error.message}`);
      } else {
        this.adapter.log.error(`discovery 3: ${JSON.stringify(error)}`);
      }
      this.ssdp_socket.close();
      this.ssdp_socket = void 0;
      this.emit("update", "error");
    });
    this.ssdp_socket.bind();
  }
  /**
   * Actived MDNS Log
   */
  mdnLog(val) {
    this.adapter.log.debug(`MDN Log: ${val}`);
    this.log = val;
  }
  /**
   * destroy
   */
  destroy() {
    this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
    if (this.ssdp_socket) {
      this.ssdp_socket.close();
      this.ssdp_socket = void 0;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lgtv_discovery
});
//# sourceMappingURL=discovery.js.map
