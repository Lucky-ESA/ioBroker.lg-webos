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
  ssdp_socket;
  adapter;
  message;
  sendTimeout;
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
    let ssdp_msg = `M-SEARCH * HTTP/1.1\r
`;
    ssdp_msg += `HOST: ${this.ssdp_ip}:${this.ssdp_port}\r
`;
    ssdp_msg += `MAN: "ssdp:discover"\r
`;
    ssdp_msg += `MX: 5\r
`;
    ssdp_msg += `ST: urn:dial-multiscreen-org:service:dial:1\r
`;
    ssdp_msg += `USER-AGENT: ioBroker\r
\r
`;
    this.message = import_node_buffer.Buffer.from(ssdp_msg);
  }
  /**
   * Send SSDP Discovery Message
   */
  _send_ssdp_discover() {
    if (!this.ssdp_socket || !this.ssdp_socket._receiving) {
      this.adapter.log.error(`Discover sspd socket not open!!!`);
      this.emit("update", "socket");
    } else {
      this.ssdp_socket.send(
        this.message,
        0,
        this.message.length,
        this.ssdp_port,
        this.ssdp_ip,
        (error) => {
          if (error) {
            this.ssdp_socket.close();
            this.emit("update", "sendError");
            if (typeof error === "string") {
              this.adapter.log.error(`discovery: ${error}`);
            } else if (error instanceof Error) {
              this.adapter.log.error(`discovery: ${error.name}: ${error.message}`);
            }
          }
        }
      );
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
      this._send_ssdp_discover();
    });
    this.ssdp_socket.on("message", (message, remote) => {
      this.adapter.log.debug(`Address: ${remote.address}`);
      this.adapter.log.debug(message);
      if (remote.address == ip) {
        this.emit("update", "found");
      }
      this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
      this.sendTimeout = this.adapter.setTimeout(() => {
        this.sendTimeout = void 0;
        this._send_ssdp_discover();
      }, 5 * 1e3);
    });
    this.ssdp_socket.on("error", (error) => {
      this.emit("update", "error");
      if (typeof error === "string") {
        this.adapter.log.error(`discovery: ${error}`);
      } else if (error instanceof Error) {
        this.adapter.log.error(`discovery: ${error.name}: ${error.message}`);
      }
      this.ssdp_socket.close();
    });
    this.ssdp_socket.bind();
  }
  /**
   * destroy
   */
  destroy() {
    if (this.ssdp_socket) {
      this.ssdp_socket.close();
    }
    this.sendTimeout && this.adapter.clearTimeout(this.sendTimeout);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  lgtv_discovery
});
//# sourceMappingURL=discovery.js.map
