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
var device_exports = {};
__export(device_exports, {
  TVHandler: () => TVHandler
});
module.exports = __toCommonJS(device_exports);
var import_multicast_dns = __toESM(require("multicast-dns"));
var import_node_events = require("node:events");
var import_partysocket = require("partysocket");
var import_uuid = require("uuid");
var import_handshake = require("./handshake");
var import_helper = require("./helper");
var import_objects = require("./objects");
var import_request = require("./request");
var import_states = require("./states");
class TVHandler extends import_node_events.EventEmitter {
  /**
   * Device
   *
   * @param iob iobroker ulits
   * @param device adapter config
   */
  constructor(iob, device) {
    super();
    this.iob = iob;
    this.device = device;
    this.adapter = iob;
    this.getRequest = new import_request.axoisRrequest();
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
    this.delayTimeout = void 0;
    this.checkCallback = void 0;
    this.subscribeChannel = void 0;
    this.checkTVStatus = void 0;
    this.pointerCheck = void 0;
    this.startWebSocketDelay = void 0;
    this.objects = new import_objects.creatObjects(device, iob);
    this.states = new import_states.updateStates(device, iob);
    this.log = false;
    this.pair = import_handshake.handshake_notpaired;
    this.socketPath = "";
    this.openPointerRequest = {
      type: void 0,
      uri: void 0,
      payload: void 0,
      first: void 0,
      prefix: void 0
    };
    void this.onReady();
  }
  adapter;
  mdn;
  ws;
  pointerWebSocket;
  isConnected;
  isPointerConnected;
  isRegistered;
  isFirstStart;
  isSubscribe;
  uri;
  mac;
  interval;
  luna;
  key;
  ip;
  dp;
  v4 = /* @__PURE__ */ new Map();
  reqResp = [];
  objects;
  states;
  errorCount;
  delayTimeout;
  checkCallback;
  subscribeChannel;
  pointerCheck;
  checkTVStatus;
  startWebSocketDelay;
  log;
  pair;
  getRequest;
  socketPath;
  openPointerRequest;
  isSettings = [];
  isStart = false;
  closeWS = "";
  /**
   * Start Class
   */
  async onReady() {
    await this.objects.createDevice();
    await this.objects.createPointerConnection();
    const state = await this.adapter.getStateAsync(`${this.dp}.system.pair_code`);
    if (state && state.val && typeof state.val === "string" && state.val.includes("aes-192-cbc")) {
      this.key = this.adapter.decrypt(state.val);
      this.pair = import_handshake.handshake_paired;
      this.pair["client-key"] = this.key;
      this.adapter.log.debug(`Key: ${this.key}`);
    }
    const respSettings = await this.adapter.getStateAsync(`${this.dp}.status.possibleSettings`);
    if (respSettings && respSettings.val && typeof respSettings.val === "string" && respSettings.val.startsWith("[")) {
      try {
        const allSettings = JSON.parse(respSettings.val);
        if (typeof allSettings === "object" && allSettings.length > 0) {
          this.isSettings = allSettings;
        }
      } catch (error) {
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
        const allStarts = JSON.parse(respStart.val);
        if (typeof allStarts === "object" && allStarts.length > 0) {
          this.isStart = true;
          for (const allStar of allStarts) {
            this.reqResp.push([
              allStar[0].toString(),
              typeof allStar[1] === "object" ? allStar[1] : JSON.parse(allStar[1])
            ]);
          }
        }
      } catch (error) {
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
  startWebSocket() {
    this.ws = new import_partysocket.WebSocket(this.uri, void 0, {
      WebSocket: (0, import_helper.webSocketClass)({
        rejectUnauthorized: false
      }),
      connectionTimeout: 1e3,
      minReconnectionDelay: 1e3,
      maxReconnectionDelay: 1e3
    });
    this.ws.addEventListener("message", async (message) => {
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
              } else if (type && this.dp && typeof type !== "object" && JSON.stringify(type).includes(this.dp)) {
                void this.isSendRequest(
                  typeof type === "string" ? type : JSON.stringify(type),
                  payload
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
                  `Starting pairing with the TV. Please confirm the pairing on the TV.`
                );
              } else if (payload.type == "registered" && payload.payload && payload.payload["client-key"]) {
                this.adapter.log.debug(`${payload.payload["client-key"]}`);
                this.adapter.log.debug(`${this.key}`);
                if (!this.key || this.key != payload.payload["client-key"]) {
                  this.key = payload.payload["client-key"];
                  if (typeof this.key === "string") {
                    if (this.pair["client-key"] == null) {
                      this.pair = import_handshake.handshake_paired;
                    }
                    this.pair["client-key"] = this.key;
                    await this.adapter.setState(`${this.dp}.system.pair_code`, {
                      val: this.adapter.encrypt(this.key),
                      ack: true
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
        } catch (error) {
          if (typeof error === "string") {
            this.adapter.log.error(`Message: ${error}`);
          } else if (error instanceof Error) {
            this.adapter.log.error(`Message: ${error.name}: ${error.message}`);
          }
        }
        void this.setResponse();
      }
    });
    this.ws.addEventListener("error", (error) => {
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
    this.ws.addEventListener("open", (open) => {
      if (this.closeWS == "Try Again Later (EWS)") {
        this.adapter.log.debug(`LGTV ${this.uri} shutdown`);
        return;
      }
      this.isConnected = true;
      void this.updateStatus(true);
      this.errorCount = 0;
      this.adapter.log.debug(`LGTV ${this.uri} opened`);
      if (open && open.returnValue) {
        this.adapter.log.debug(`Open: ${JSON.stringify(open.returnValue)}`);
      }
      if (typeof this.key !== "string" || !this.isRegistered) {
        if (!this.key || this.key == "") {
          this.adapter.log.warn(`Start pairing!!!`);
        }
        this.sendCommand("register", void 0, this.pair);
      }
    });
    this.ws.addEventListener("close", (close) => {
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
  startpointerWebSocket() {
    if (this.socketPath == "") {
      this.adapter.log.warn(`Cannot found cursor address!!!`);
      return;
    }
    this.pointerWebSocket = new import_partysocket.WebSocket(this.socketPath, void 0, {
      WebSocket: (0, import_helper.webSocketClass)({
        rejectUnauthorized: false
      }),
      connectionTimeout: 2e3,
      minReconnectionDelay: 1e4,
      maxReconnectionDelay: 1e4
    });
    this.pointerWebSocket.addEventListener("message", (message) => {
      this.adapter.log.debug(`LGTV cursor connection ${this.uri} message`);
      this.isPointerConnected = true;
      if (message && message.data) {
        this.adapter.log.debug(`Message: ${JSON.stringify(message.data)}`);
      }
    });
    this.pointerWebSocket.addEventListener("error", async (error) => {
      this.isPointerConnected = false;
      if (this.isPointerConnected) {
        await this.updatePointerStatus(false);
      }
      this.adapter.log.debug(`LGTV cursor connection ${this.uri} error`);
      if (error && error.message) {
        this.adapter.log.debug(`Error: ${error.message}`);
      }
    });
    this.pointerWebSocket.addEventListener("open", async (open) => {
      this.isPointerConnected = true;
      this.getPointerCheck();
      await this.updatePointerStatus(true);
      this.adapter.log.debug(`LGTV cursor connection ${this.uri} opened`);
      if (open && open.returnValue) {
        this.adapter.log.debug(`Open cursor: ${JSON.stringify(open.returnValue)}`);
      }
      if (this.openPointerRequest.first && this.openPointerRequest.type && this.openPointerRequest.uri) {
        this.sendCommand(
          this.openPointerRequest.type,
          this.openPointerRequest.uri,
          this.openPointerRequest.payload,
          this.openPointerRequest.first,
          this.openPointerRequest.prefix
        );
      }
    });
    this.pointerWebSocket.addEventListener("close", async (close) => {
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
  getPointerCheck() {
    this.pointerCheck && this.adapter.clearTimeout(this.pointerCheck);
    this.pointerCheck = this.adapter.setTimeout(
      () => {
        if (this.pointerWebSocket) {
          this.pointerWebSocket.close();
          this.pointerWebSocket = null;
        }
        this.pointerCheck = void 0;
        void this.updatePointerStatus(false);
      },
      60 * 1e3 * 5
    );
  }
  /**
   * Create States after restart
   *
   * @param val LGResponse
   */
  async ownRequest(val) {
    await this.adapter.setState(`${this.dp}.remote.own_request.response`, { val: JSON.stringify(val), ack: true });
    await this.setAckFlag(`${this.dp}.remote.own_request.request`);
  }
  /**
   * Set ack flag
   *
   * @param objectId ioBroker object id
   */
  async isSendRequest(objectId, res) {
    await this.setAckFlag(objectId);
    if (objectId != "" && objectId.includes("keys.screenshot") && res.payload && res.payload.returnValue && res.payload.imageUri != "") {
      void this.saveScreenshot(res.payload.imageUri);
    }
  }
  /**
   * Save screenshots
   *
   * @param url Icon URL
   */
  async saveScreenshot(url) {
    this.adapter.log.debug(`Screenshot: ${url}`);
    const resp = await this.getRequest.get(url);
    if (resp && resp.data) {
      const file = url.split(".");
      const ext = file.pop();
      const filename = (/* @__PURE__ */ new Date()).getTime();
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
  async updateStatus(val) {
    await this.adapter.setState(`${this.dp}.status.online`, { val, ack: true });
    if (!val) {
      const available = this.getRespRequestFind(import_helper.Endpoint.GET_POWER_STATE, "uri");
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
  async updatePointerStatus(val) {
    await this.adapter.setState(`${this.dp}.status.pointerConnection`, { val, ack: true });
  }
  /**
   * Save response
   */
  async setResponse() {
    await this.adapter.setState(`${this.dp}.status.responseStart`, {
      val: JSON.stringify(this.reqResp),
      ack: true
    });
  }
  /**
   * Save first response
   */
  async setFirstResponse() {
    await this.sleep(5e3);
    await this.adapter.setState(`${this.dp}.status.responseStart`, {
      val: JSON.stringify(this.reqResp),
      ack: true
    });
    const settings = [];
    for (const r of this.reqResp) {
      if (r[1].settings != "No Value" && r[1].settings != "" && r[1].category == "picture" && !r[1].settings.includes(",")) {
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
  async createStateFirst(val) {
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
      if (val.payload.features && val.payload.features["3d"] || val.payload.configs && val.payload.configs["tv.model.3dSupportType"] == "3D") {
        let first = null;
        if (this.isFirstStart) {
          first = "First";
        }
        this.sendCommand("subscribe", import_helper.Endpoint.GET_3D_STATUS, null, first);
      }
    } else if (val.payload.apps) {
      await this.objects.createApps(val);
    } else if (val.payload.socketPath != null && val.payload.socketPath != "") {
      this.socketPath = val.payload.socketPath;
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
  async updateStates(val) {
    this.adapter.log.debug(`Update: ${JSON.stringify(val)}`);
    if (val.payload.appId != null && val.payload.appId != "") {
      await this.states.updateAppId(val);
      if (val.payload.appId == "com.webos.app.livetv") {
        this.subscribeChannel = this.adapter.setTimeout(async () => {
          this.sendCommand("subscribe", import_helper.Endpoint.GET_CURRENT_CHANNEL, null, null);
          await this.sleep(100);
          this.sendCommand("subscribe", import_helper.Endpoint.GET_CURRENT_PROGRAM_INFO, null, null);
          this.isSubscribe = true;
          this.subscribeChannel = void 0;
        }, 3e3);
      } else {
        await this.states.cleanUpChannel();
        if (this.isSubscribe) {
          this.sendCommand("unsubscribe", import_helper.Endpoint.GET_CURRENT_CHANNEL, null, null);
          await this.sleep(100);
          this.sendCommand("unsubscribe", import_helper.Endpoint.GET_CURRENT_PROGRAM_INFO, null, null);
          this.isSubscribe = false;
        }
        this.subscribeChannel && this.adapter.clearTimeout(this.subscribeChannel);
        this.subscribeChannel = void 0;
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
      ack: true
    });
  }
  /**
   * Request device infos
   */
  async getDeviceInfos() {
    let first = null;
    if (this.isFirstStart) {
      first = "First";
    }
    let check = void 0;
    this.sendCommand("subscribe", import_helper.Endpoint.SEND_REGISTER, null, first);
    await this.sleep(100);
    check = this.getRespRequestFind(import_helper.Endpoint.GET_SERVICES, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand("request", import_helper.Endpoint.GET_SERVICES, null, first);
      await this.sleep(100);
    }
    this.sendCommand("request", import_helper.Endpoint.GET_AUDIO_STATUS, null, first);
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_APPS_ALL, null, first);
    await this.sleep(100);
    this.sendCommand("request", import_helper.Endpoint.GET_SOFTWARE_INFO, null, first);
    await this.sleep(100);
    check = this.getRespRequestFind(import_helper.Endpoint.GET_SYSTEM_INFO, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand("request", import_helper.Endpoint.GET_SYSTEM_INFO, null, first);
      await this.sleep(100);
    }
    this.sendCommand("request", import_helper.Endpoint.GET_CHANNEL_INFO, null, first);
    await this.sleep(100);
    check = this.getRespRequestFind(import_helper.Endpoint.GET_POWER_STATE, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand("subscribe", import_helper.Endpoint.GET_POWER_STATE, null, first);
      await this.sleep(100);
    }
    check = this.getRespRequestFind(import_helper.Endpoint.GET_CONFIGS, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand(
        "subscribe",
        import_helper.Endpoint.GET_CONFIGS,
        { configNames: ["tv.model.*", "tv.rmm.*", "tv.hw.*", "system.*", "tv.config.*", "tv.conti.*"] },
        first
      );
      await this.sleep(100);
    }
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_CURRENT_CHANNEL, null, first);
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_CURRENT_PROGRAM_INFO, null, first);
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_SOUND_OUTPUT, null, first);
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_VOLUME, null, first);
    await this.sleep(100);
    check = this.getRespRequestFind(import_helper.Endpoint.GET_TV_TIME, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand("request", import_helper.Endpoint.GET_TV_TIME, null, first);
      await this.sleep(100);
    }
    this.sendCommand("request", import_helper.Endpoint.GET_TV_CHANNELS, null, first);
    await this.sleep(100);
    this.sendCommand("subscribe", import_helper.Endpoint.GET_INPUTS, null, first);
    await this.sleep(100);
    this.sendCommand("request", import_helper.Endpoint.INPUT_SOCKET, null, first);
    await this.sleep(100);
    check = this.getRespRequestFind(import_helper.Endpoint.GET_TV_TIME, "uri");
    if (check == void 0 || check[1] && check[1].response == "response") {
      this.sendCommand("subscribe", import_helper.Endpoint.LIST_DEVICES, null, first);
      await this.sleep(100);
    }
    this.sendCommand("subscribe", import_helper.Endpoint.GET_APPS, null, first);
    await this.sleep(100);
    this.sendCommand(
      "subscribe",
      import_helper.Endpoint.GET_SYSTEM_SETTINGS,
      { category: "network", keys: ["deviceName"] },
      first
    );
    await this.sleep(100);
    this.sendCommand(
      "subscribe",
      import_helper.Endpoint.GET_SYSTEM_SETTINGS,
      { category: "network", keys: ["wolwowlOnOff"] },
      first
    );
    await this.sleep(100);
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
      "eyeComfortMode"
    ];
    if (this.isSettings.length > 0) {
      this.sendCommand(
        "subscribe",
        import_helper.Endpoint.GET_SYSTEM_SETTINGS,
        {
          category: "picture",
          keys: this.isSettings
        },
        first
      );
      await this.sleep(100);
    } else if (this.reqResp && this.reqResp.length > 0) {
      for (const key of keys) {
        this.sendCommand(
          "subscribe",
          import_helper.Endpoint.GET_SYSTEM_SETTINGS,
          {
            category: "picture",
            keys: [key]
          },
          first
        );
        await this.sleep(100);
      }
    }
    this.sendCommand("subscribe", import_helper.Endpoint.GET_CURRENT_APP_INFO, null, first);
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
  startCheckStatus(start) {
    this.checkTVStatus && this.adapter.clearInterval(this.checkTVStatus);
    this.checkTVStatus = void 0;
    if (start) {
      this.checkTVStatus = this.adapter.setInterval(() => {
        const available = this.getRespRequestFind(import_helper.Endpoint.GET_POWER_STATE, "uri");
        if (available && available[1] && available[1].response == "response") {
          this.sendCommand("request", import_helper.Endpoint.GET_POWER_STATE, null, null);
        } else {
          const tv_time = this.getRespRequestFind(import_helper.Endpoint.GET_TV_TIME, "uri");
          if (tv_time && tv_time[1] && tv_time[1].response == "response") {
            this.sendCommand("request", import_helper.Endpoint.GET_TV_TIME, null, null);
          } else {
            this.adapter.log.debug(`No request works!!!`);
          }
        }
      }, this.interval * 1e3);
    }
  }
  /**
   * Send Callback
   *
   * @param obj Message
   */
  sendObjCallback(obj, message) {
    if (obj.callback) {
      this.adapter.sendTo(obj.from, obj.command, message, obj.callback);
    }
  }
  /**
   * Start MDNS Service
   */
  async startWatching() {
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
    await this.sleep(3e3);
    this.startMulticast();
  }
  /**
   * Start MDNS Service
   */
  startMulticast() {
    this.startWebSocketDelay && this.adapter.clearTimeout(this.startWebSocketDelay);
    this.startWebSocketDelay = void 0;
    if (!this.mdn) {
      this.mdn = (0, import_multicast_dns.default)();
      this.mdn.query({
        questions: [
          {
            name: "_services._dns-sd._udp.local",
            type: "PTR"
          }
        ]
      });
      this.adapter.log.debug(`Watching response!`);
      this.mdn.on("response", (response) => {
        var _a;
        if (this.log) {
          this.adapter.log.info(`MDN: ${JSON.stringify(response)}`);
        }
        const device = response.answers.find((dev) => dev.data == this.ip);
        let isOnline = false;
        if (device != void 0) {
          if (device.type == "A" || device.type == "AAAA") {
            if (device.flush) {
              isOnline = true;
            }
          }
        } else {
          const oldDevice = response.additionals.find((dev) => dev.data == this.ip);
          if (oldDevice != void 0) {
            if (oldDevice.type == "A" || oldDevice.type == "AAAA") {
              if (response.id > 0) {
                isOnline = true;
              }
            }
          }
        }
        if (isOnline) {
          this.adapter.log.info(`Found device ${this.ip}`);
          (_a = this.mdn) == null ? void 0 : _a.destroy();
          this.mdn = null;
          this.delayStartWebSocket();
        }
      });
    }
  }
  /**
   * Start WebSocket
   */
  delayStartWebSocket() {
    this.startWebSocketDelay && this.adapter.clearTimeout(this.startWebSocketDelay);
    this.startWebSocketDelay = this.adapter.setTimeout(() => {
      this.startWebSocket();
      void this.updateStatus(true);
      this.startWebSocketDelay = void 0;
    }, 3 * 1e3);
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
  async MessageHandler(id, type, uri, payload, prefix = `ssap://`) {
    this.adapter.log.debug(JSON.stringify({ id, type, uri, payload, prefix }));
    let dp_message = "createToast";
    let dp_close = "closeToast";
    let attribute = "toastId";
    if (type === "createAlert" || type === "closeAlert") {
      dp_message = "createAlert";
      dp_close = "closeAlert";
      attribute = "alertId";
    }
    const obj = await this.adapter.getObjectAsync(`${this.dp}.remote.notify.${dp_close}`);
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
  request(id, type, uri, payload, prefix = `ssap://`) {
    this.adapter.log.debug(JSON.stringify({ id, type, uri, payload, prefix }));
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
  async wol(id) {
    if (this.ip && this.mac) {
      const val = await (0, import_helper.promisedWol)(this.mac);
      if (val) {
        await this.adapter.setState(id, { ack: true });
        this.adapter.log.info(`Send wol: ${this.mac} - ${this.ip}`);
      } else {
        this.adapter.log.info(`Send wol error: ${val}`);
      }
      const address = await (0, import_helper.promisedWolAddress)(this.mac, this.ip);
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
  checkOpenMessage() {
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
  async messageDirect(obj) {
    if (!this.isConnected || !this.isRegistered) {
      this.sendObjCallback(obj, { error: "Device is offline or disconneted!" });
      return;
    }
    if (obj.message.name != "") {
      const ip = (0, import_helper.forbidden_ip)(obj.message.name, this.adapter.FORBIDDEN_CHARS);
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
              this.pointerWebSocket.send(`${obj.message.send}

`);
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
      this.checkCallback = void 0;
      this.checkOpenMessage();
    }, 5 * 1e3);
  }
  /**
   * Sends a message
   *
   * @param obj Message
   */
  async message(obj) {
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
        const socketPath = await this.sendPromiseCommand("request", import_helper.Endpoint.INPUT_SOCKET, null);
        if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
          this.socketPath = socketPath.payload.socketPath;
          this.openPointerRequest = {
            type: obj.message.type,
            uri: obj.message.uri,
            payload: obj.message.payload,
            first: obj,
            prefix: obj.message.prefix
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
      this.checkCallback = void 0;
      this.checkOpenMessage();
    }, 5 * 1e3);
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
  async sendPointer(id, type, uri, payload, prefix = `ssap://`) {
    if (!this.pointerWebSocket) {
      const socketPath = await this.sendPromiseCommand("request", import_helper.Endpoint.INPUT_SOCKET, null);
      if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
        this.socketPath = socketPath.payload.socketPath;
        this.openPointerRequest = {
          type,
          uri,
          payload,
          first: id,
          prefix
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
  async own_request(type, uri, payload, prefix = `ssap://`) {
    this.adapter.log.debug(JSON.stringify({ type, uri, payload, prefix }));
    if (prefix == "luna://" && type != "pointer") {
      if (uri) {
        await this.sendLunaRequest("Own", type, uri, payload);
      }
    } else if (type != "pointer") {
      this.sendCommand(type, uri, payload, "Own", prefix);
    } else {
      if (!this.pointerWebSocket) {
        const socketPath = await this.sendPromiseCommand("request", import_helper.Endpoint.INPUT_SOCKET, null);
        if (socketPath && socketPath.payload && socketPath.payload.socketPath != "") {
          this.socketPath = socketPath.payload.socketPath;
          this.openPointerRequest = {
            type,
            uri,
            payload,
            first: "Own",
            prefix
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
          info: "Send button ok"
        }
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
  sendCommand(type, uri, payload, first, prefix) {
    this.adapter.log.debug(
      `sendCommand: ${JSON.stringify({ type, uri, payload, first, prefix })}`
    );
    const id = type == "register" ? "register_0" : (0, import_uuid.v4)();
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
        category: "No Value"
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
      prefix = "ssap://";
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
        `Send Request with id ${id}, uri ${uri_complete} and request ${JSON.stringify(payload)}`
      );
      this.ws.send(
        JSON.stringify({
          id,
          type,
          uri: uri_complete,
          payload
        })
      );
    } else if (type == "pointer" && typeof payload === "object" && this.pointerWebSocket && this.isPointerConnected) {
      const message = Object.keys(payload).reduce(
        (all, param) => {
          return all.concat([`${param}:${payload[param]}`]);
        },
        [`type:${uri_complete}`]
      ).join("\n");
      this.adapter.log.debug(`Send Request with id ${id}, uri ${uri_complete} and request ${message}

`);
      this.pointerWebSocket.send(`${message}

`);
      this.v4.delete(id);
      this.getPointerCheck();
      if (typeof first === "string" && this.dp != void 0 && first.includes(this.dp)) {
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
  async sendLunaRequest(first, type, uri, params) {
    this.adapter.log.debug(
      `Send Luna Request with id ${first}, type ${type}, uri ${uri} and request ${JSON.stringify(params)}`
    );
    const buttons = [{ label: "", onClick: uri, params }];
    const payload = {
      message: "Update settings!",
      buttons,
      onclose: { uri, params },
      onfail: { uri, params }
    };
    const messageId = await this.sendPromiseCommand("request", import_helper.Endpoint.CREATE_ALERT, payload);
    if (first == "Own") {
      void this.ownRequest(messageId);
    }
    if (messageId && messageId.id) {
      if (this.v4.get(messageId.id)) {
        this.v4.delete(messageId.id);
      }
    }
    if (messageId && messageId.payload && messageId.payload.alertId) {
      const resp = await this.sendPromiseCommand("request", import_helper.Endpoint.CLOSE_ALERT, {
        alertId: messageId.payload.alertId
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
        if (typeof first === "string" && this.dp != void 0 && first.includes(this.dp)) {
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
  async sendPromiseCommand(type, uri, payload, prefix = `ssap://`) {
    return new Promise((resolve, reject) => {
      var _a, _b;
      if (!this.isConnected || !this.isRegistered) {
        reject;
      }
      const id = (0, import_uuid.v4)();
      this.v4.set(id, "PromiseResponse");
      const listener = (event) => {
        var _a2;
        try {
          const json = JSON.parse(event.data.toString());
          if (json.id && json.id === id) {
            (_a2 = this.ws) == null ? void 0 : _a2.removeEventListener("message", listener);
            return resolve(json);
          }
        } catch {
          this.v4.delete(id);
          return reject;
        }
      };
      (_a = this.ws) == null ? void 0 : _a.addEventListener("message", listener);
      (_b = this.ws) == null ? void 0 : _b.send(
        JSON.stringify({
          id,
          type,
          uri: `${prefix}${uri}`,
          payload
        })
      );
      this.adapter.setTimeout(() => {
        var _a2;
        (_a2 = this.ws) == null ? void 0 : _a2.removeEventListener("message", listener);
        this.v4.delete(id);
        reject;
      }, 1e3 * 5);
    });
  }
  /**
   * Sends a message with promise response
   *
   * @param payload Payload
   * @returns Response
   */
  async sendDirectPromiseCommand(payload) {
    return new Promise((resolve, reject) => {
      var _a, _b;
      if (!this.isConnected || !this.isRegistered) {
        reject;
      }
      let val;
      try {
        val = JSON.parse(payload);
      } catch {
        reject;
      }
      const listener = (event) => {
        var _a2;
        try {
          const json = JSON.parse(event.data.toString());
          if (json.id && json.id === val.id) {
            (_a2 = this.ws) == null ? void 0 : _a2.removeEventListener("message", listener);
            return resolve(json);
          } else if (json.type == "error") {
            return resolve(json);
          }
        } catch {
          return reject;
        }
      };
      (_a = this.ws) == null ? void 0 : _a.addEventListener("message", listener);
      (_b = this.ws) == null ? void 0 : _b.send(JSON.stringify(payload));
      this.adapter.setTimeout(() => {
        var _a2;
        (_a2 = this.ws) == null ? void 0 : _a2.removeEventListener("message", listener);
        reject;
      }, 1e3 * 5);
    });
  }
  /**
   * Sleep
   *
   * @param ms milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => {
      this.delayTimeout = this.adapter.setTimeout(resolve, ms);
    });
  }
  /**
   * Actived MDNS Log
   */
  mdnLog(val) {
    this.adapter.log.debug(`MDN Log: ${val}`);
    this.log = val;
  }
  /**
   * Set ack flag
   *
   * @param id ioBroker object id
   */
  async setAckFlag(id) {
    await this.adapter.setState(id, { ack: true });
  }
  /**
   * Check response error or response
   *
   * @param val find string
   * @param key key
   * @returns [string, respCheck] | undefined
   */
  getRespRequestFind(val, key) {
    const entry = this.reqResp.find((r) => r[1][key] === val);
    if (entry) {
      return entry;
    }
    return void 0;
  }
  /**
   * Check response error or response
   *
   * @param val find string
   * @param key key
   * @param valSecond find string
   * @returns [string, respCheck] | undefined
   */
  getRespRequestFindSecond(val, key, valSecond) {
    const entry = this.reqResp.find((r) => r[1][key] === val && r[1].settings === valSecond);
    if (entry) {
      return entry;
    }
    return void 0;
  }
  /**
   * Find request with 32Bits URI
   *
   * @param key V4 UUID
   * @returns [string, respCheck] | undefined
   */
  getRespRequestKeyFind(key) {
    const entry = this.reqResp.find((r) => r[0] === key);
    if (entry) {
      return entry;
    }
    return void 0;
  }
  /**
   * Remove request
   *
   * @param uuid V4 UUID
   */
  removeRespCheckUuid(uuid) {
    this.reqResp = this.reqResp.filter((r) => r[0] !== uuid);
  }
  /**
   * Set response value
   *
   * @param resp TV Response
   */
  setResponseValue(resp) {
    if (!resp.id) {
      this.adapter.log.error(`Unknown error: ${JSON.stringify(resp)}`);
      return;
    }
    const entry = this.getRespRequestKeyFind(resp.id);
    if (entry && entry[1] != null) {
      entry[1].response = resp.type;
      if (resp.type == "error") {
        entry[1].error = resp.error ? resp.error : "Unknown error";
        if (resp.payload && resp.payload.errorCode != void 0) {
          entry[1].errorCode = resp.payload.errorCode;
        }
        if (resp.payload && resp.payload.errorText != void 0) {
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
  async destroy() {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TVHandler
});
//# sourceMappingURL=device.js.map
