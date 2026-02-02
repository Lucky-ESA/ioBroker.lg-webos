"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var utils = __toESM(require("@iobroker/adapter-core"));
var import_device = require("./api/device");
var import_helper = require("./api/helper");
class LgWebos extends utils.Adapter {
  devices = /* @__PURE__ */ new Map();
  oldDevice = /* @__PURE__ */ new Map();
  picture = /* @__PURE__ */ new Map();
  devicesStatus = [];
  connection;
  constructor(options = {}) {
    super({
      ...options,
      name: "lg-webos"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.connection = false;
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    var _a;
    await this.setState("info.connection", false, true);
    if (this.config.devices && typeof this.config.devices === "object" && this.config.devices.length > 0) {
      for (const dev of this.config.devices) {
        if (dev.active) {
          if (dev.ip != "") {
            dev.dp = (0, import_helper.forbidden_ip)(dev.ip, this.FORBIDDEN_CHARS);
            if (dev.Interval < 0 || dev.Interval > 1440) {
              dev.Interval = 0;
            }
            const devObj = Object.assign({}, dev);
            this.devicesStatus.push({ ip: dev.dp, status: false });
            this.devices.set(dev.dp, new import_device.TVHandler(this, devObj));
            (_a = this.devices.get(dev.dp)) == null ? void 0 : _a.on("update", this.getUpdateData.bind(this));
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
  async checkDeviceFolder() {
    try {
      this.log.info(`Start check devices object!`);
      const devices = await this.getDevicesAsync();
      for (const element of devices) {
        const id = element._id.split(".").pop();
        const device = this.config.devices.find((dev) => dev.dp === id);
        if (device !== -1) {
          this.log.debug(`Found device ${element._id}`);
        } else {
          this.log.info(`Delete device ${element._id}`);
          await this.delObjectAsync(`${id}`, { recursive: true });
        }
      }
    } catch (error) {
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
  async onUnload(callback) {
    var _a;
    try {
      for (const id in this.devices.keys()) {
        await ((_a = this.devices.get(id)) == null ? void 0 : _a.destroy());
      }
      callback();
    } catch (error) {
      this.log.error(`Error during unloading: ${error.message}`);
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
  onStateChange(id, state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X;
    if (state && !state.ack) {
      const idParts = id.split(".");
      const command = idParts.pop();
      const deviceId = id.split(".")[2];
      if (!this.devices.get(deviceId)) {
        this.log.error(`Device ${deviceId} is disabled`);
        return;
      }
      let digit = "0";
      const settings = {};
      let level = {};
      let system = import_helper.Endpoint.LUNA_SET_SYSTEM_SETTINGS;
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
          (_a = this.devices.get(deviceId)) == null ? void 0 : _a.request(id, "pointer", import_helper.Endpoint.SET_BUTTON, { name: command.toString().toUpperCase() }, "");
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
          (_b = this.devices.get(deviceId)) == null ? void 0 : _b.request(id, "pointer", import_helper.Endpoint.SET_BUTTON, { name: digit }, "");
          break;
        case "enter":
          (_c = this.devices.get(deviceId)) == null ? void 0 : _c.request(id, "request", import_helper.Endpoint.SEND_ENTER);
          break;
        case "mute":
          (_d = this.devices.get(deviceId)) == null ? void 0 : _d.request(id, "request", import_helper.Endpoint.SET_MUTE, { mute: state.val ? true : false });
          break;
        case "channelDown":
          (_e = this.devices.get(deviceId)) == null ? void 0 : _e.request(id, "request", import_helper.Endpoint.TV_CHANNEL_DOWN);
          break;
        case "channelUp":
          (_f = this.devices.get(deviceId)) == null ? void 0 : _f.request(id, "request", import_helper.Endpoint.TV_CHANNEL_UP);
          break;
        case "volumeUp":
          (_g = this.devices.get(deviceId)) == null ? void 0 : _g.request(id, "request", import_helper.Endpoint.VOLUME_UP);
          break;
        case "volumeDown":
          (_h = this.devices.get(deviceId)) == null ? void 0 : _h.request(id, "request", import_helper.Endpoint.VOLUME_DOWN);
          break;
        case "rtlPlus":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_i = this.devices.get(deviceId)) == null ? void 0 : _i.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "com.netrtl.tvnow"
            });
          }
          break;
        case "disneyPlus":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_j = this.devices.get(deviceId)) == null ? void 0 : _j.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "com.disney.disneyplus-prod"
            });
          }
          break;
        case "youtube":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_k = this.devices.get(deviceId)) == null ? void 0 : _k.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "youtube.leanback.v4"
            });
          }
          break;
        case "appletv":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_l = this.devices.get(deviceId)) == null ? void 0 : _l.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "com.apple.appletv"
            });
          }
          break;
        case "netflix":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_m = this.devices.get(deviceId)) == null ? void 0 : _m.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "netflix"
            });
          }
          break;
        case "amazon":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_n = this.devices.get(deviceId)) == null ? void 0 : _n.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "amazon"
            });
          }
          break;
        case "amazonAlexa":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_o = this.devices.get(deviceId)) == null ? void 0 : _o.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "amazon.alexa.view"
            });
          }
          break;
        case "joyn":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_p = this.devices.get(deviceId)) == null ? void 0 : _p.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: "joyn"
            });
          }
          break;
        case "openURL":
          if (typeof state.val === "string" && state.val != null && state.val != "") {
            (_q = this.devices.get(deviceId)) == null ? void 0 : _q.request(id, "request", import_helper.Endpoint.OPEN, {
              target: state.val
            });
          }
          break;
        case "3Dmode":
          if (state.val) {
            (_r = this.devices.get(deviceId)) == null ? void 0 : _r.request(id, "request", import_helper.Endpoint.SET_3D_ON);
          } else {
            (_s = this.devices.get(deviceId)) == null ? void 0 : _s.request(id, "request", import_helper.Endpoint.SET_3D_OFF);
          }
          break;
        case "channel":
          if (typeof state.val === "number" && state.val != null) {
            (_t = this.devices.get(deviceId)) == null ? void 0 : _t.request(id, "request", import_helper.Endpoint.SET_CHANNEL, {
              channelNumber: state.val.toString()
            });
          }
          break;
        case "channelId":
          if (typeof state.val === "string" && state.val != null) {
            (_u = this.devices.get(deviceId)) == null ? void 0 : _u.request(id, "request", import_helper.Endpoint.SET_CHANNEL, {
              channelId: state.val
            });
          }
          break;
        case "input":
        case "launch":
          if (typeof state.val === "string" && state.val != null && state.val != "unknown") {
            (_v = this.devices.get(deviceId)) == null ? void 0 : _v.request(id, "request", import_helper.Endpoint.LAUNCH, {
              id: state.val
            });
          }
          break;
        case "soundOutput":
          (_w = this.devices.get(deviceId)) == null ? void 0 : _w.request(id, "request", import_helper.Endpoint.CHANGE_SOUND_OUTPUT, { output: state.val });
          break;
        case "volume":
          if (typeof state.val === "number" && state.val != null && state.val >= 0 && state.val <= 100) {
            (_x = this.devices.get(deviceId)) == null ? void 0 : _x.request(id, "request", import_helper.Endpoint.SET_VOLUME, { volume: state.val });
          }
          break;
        case "powerOff":
          (_y = this.devices.get(deviceId)) == null ? void 0 : _y.request(id, "request", import_helper.Endpoint.POWER_OFF);
          break;
        case "powerOn":
          void ((_z = this.devices.get(deviceId)) == null ? void 0 : _z.wol(id));
          break;
        case "screenOff":
          level = import_helper.Endpoint.TURN_OFF_SCREEN;
          if (this.oldDevice.get(deviceId)) {
            level = import_helper.Endpoint.TURN_OFF_SCREEN_OD;
          }
          (_A = this.devices.get(deviceId)) == null ? void 0 : _A.request(id, "request", level, { standbyMode: "active" });
          break;
        case "screenOn":
          level = import_helper.Endpoint.TURN_ON_SCREEN;
          if (this.oldDevice.get(deviceId)) {
            level = import_helper.Endpoint.TURN_ON_SCREEN_OD;
          }
          (_B = this.devices.get(deviceId)) == null ? void 0 : _B.request(id, "request", level, { standbyMode: "active" });
          break;
        case "closeAlert":
          if (state.val != null && state.val != "no") {
            void ((_C = this.devices.get(deviceId)) == null ? void 0 : _C.MessageHandler(id, "closeAlert", import_helper.Endpoint.CLOSE_ALERT, { alertId: state.val }));
          }
          break;
        case "createAlert":
          void ((_D = this.devices.get(deviceId)) == null ? void 0 : _D.MessageHandler(id, "createAlert", import_helper.Endpoint.CREATE_ALERT, {
            message: state.val,
            buttons: [{ label: "OK" }]
          }));
          break;
        case "closeToast":
          if (state.val != null && state.val != "no") {
            void ((_E = this.devices.get(deviceId)) == null ? void 0 : _E.MessageHandler(id, "closeToast", import_helper.Endpoint.CLOSE_TOAST, { toastId: state.val }));
          }
          break;
        case "createToast":
          void ((_F = this.devices.get(deviceId)) == null ? void 0 : _F.MessageHandler(id, "createToast", import_helper.Endpoint.CREATE_TOAST, { message: state.val }));
          break;
        case "request":
          this.own_request(deviceId, state);
          break;
        case "click":
          (_G = this.devices.get(deviceId)) == null ? void 0 : _G.request(id, "pointer", import_helper.Endpoint.CURSOR_CLICK, null, "");
          break;
        case "drag":
          if (state.val && ~state.val.toString().indexOf(",")) {
            const vals = state.val.toString().split(",");
            const dx = parseInt(vals[0]);
            const dy = parseInt(vals[1]);
            const drag = vals[2] == "drag" ? 1 : 0;
            (_H = this.devices.get(deviceId)) == null ? void 0 : _H.request(
              id,
              "pointer",
              import_helper.Endpoint.CURSOR_DRAG,
              {
                dx,
                dy,
                drag
              },
              ""
            );
          }
          break;
        case "scroll":
          if (state.val && ~state.val.toString().indexOf(",")) {
            const vals = state.val.toString().split(",");
            const dx = parseInt(vals[0]);
            const dy = parseInt(vals[1]);
            (_I = this.devices.get(deviceId)) == null ? void 0 : _I.request(id, "pointer", import_helper.Endpoint.CURSOR_SCROLL, { dx, dy }, "");
          }
          break;
        case "mdnLog":
          if (state.val != null && typeof state.val === "boolean") {
            (_J = this.devices.get(deviceId)) == null ? void 0 : _J.mdnLog(state.val);
          }
          break;
        case "deleteText":
          (_K = this.devices.get(deviceId)) == null ? void 0 : _K.request(id, "request", import_helper.Endpoint.SEND_DELETE);
          break;
        case "insertText":
          if (state.val != null && typeof state.val === "string") {
            (_L = this.devices.get(deviceId)) == null ? void 0 : _L.request(id, "request", import_helper.Endpoint.INSERT_TEXT, { text: state.val });
          }
          break;
        case "closeLaunch":
          (_M = this.devices.get(deviceId)) == null ? void 0 : _M.request(id, "request", import_helper.Endpoint.LAUNCHER_CLOSE);
          break;
        case "screenshot":
          (_N = this.devices.get(deviceId)) == null ? void 0 : _N.request(id, "request", import_helper.Endpoint.TAKE_SCREENSHOT);
          break;
        case "closeWebApp":
          (_O = this.devices.get(deviceId)) == null ? void 0 : _O.request(id, "request", import_helper.Endpoint.CLOSE_WEB_APP);
          break;
        case "screenSaver":
          (_P = this.devices.get(deviceId)) == null ? void 0 : _P.request(id, "request", import_helper.Endpoint.LUNA_TURN_ON_SCREEN_SAVER, {}, "luna://");
          break;
        case "showInputPicker":
          (_Q = this.devices.get(deviceId)) == null ? void 0 : _Q.request(id, "request", import_helper.Endpoint.LUNA_SHOW_INPUT_PICKER, null, "luna://");
          break;
        case "brightness":
        case "backlight":
        case "contrast":
        case "color":
        case "sharpness":
        case "tint":
          settings[command] = (_R = state.val) == null ? void 0 : _R.toString();
          if (this.picture.get(deviceId)) {
            system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
            method = "ssap://";
          }
          (_S = this.devices.get(deviceId)) == null ? void 0 : _S.request(
            id,
            "request",
            system,
            {
              category: "picture",
              settings
            },
            method
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
            system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
            method = "ssap://";
          }
          (_T = this.devices.get(deviceId)) == null ? void 0 : _T.request(
            id,
            "request",
            system,
            {
              category: "picture",
              settings
            },
            method
          );
          break;
        case "motionEyeCare":
        case "realCinema":
        case "eyeComfortMode":
          settings[command] = state.val ? "on" : "off";
          if (this.picture.get(deviceId)) {
            system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
            method = "ssap://";
          }
          (_U = this.devices.get(deviceId)) == null ? void 0 : _U.request(
            id,
            "request",
            system,
            {
              category: "picture",
              settings
            },
            method
          );
          break;
        case "blackLevel":
          if (typeof state.val === "string" && state.val.startsWith("{")) {
            try {
              level = JSON.parse(state.val);
              if (this.picture.get(deviceId)) {
                system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
                method = "ssap://";
              }
              (_V = this.devices.get(deviceId)) == null ? void 0 : _V.request(
                id,
                "request",
                system,
                {
                  category: "picture",
                  settings: { blackLevel: level }
                },
                method
              );
            } catch (error) {
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
            system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
            method = "ssap://";
          }
          (_W = this.devices.get(deviceId)) == null ? void 0 : _W.request(
            id,
            "request",
            system,
            {
              category: "network",
              settings: { deviceName: state.val }
            },
            method
          );
          break;
        case "wolwowlOnOff":
          if (this.picture.get(deviceId)) {
            system = import_helper.Endpoint.SET_SYSTEM_SETTINGS;
            method = "ssap://";
          }
          (_X = this.devices.get(deviceId)) == null ? void 0 : _X.request(
            id,
            "request",
            system,
            {
              category: "network",
              settings: { wolwowlOnOff: state.val ? "true" : "false" }
            },
            method
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
  own_request(deviceId, state) {
    var _a;
    if (state && state.val && typeof state.val === "string" && state.val.startsWith("{")) {
      const json = JSON.parse(state.val);
      if (json.type) {
        void ((_a = this.devices.get(deviceId)) == null ? void 0 : _a.own_request(json.type, json.uri, json.payload, json.prefix));
      }
    }
  }
  /**
   * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
   * Using this method requires "common.messagebox" property to be set to true in io-package.json
   *
   * @param obj ioBroker.Message
   */
  onMessage(obj) {
    var _a, _b, _c, _d;
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "sendTV" || obj.command === "sendData") {
        if (obj.message.name) {
          if (obj.message.name === "all") {
            if (obj.callback) {
              this.sendTo(
                obj.from,
                obj.command,
                { error: "Multi callback is not possible!" },
                obj.callback
              );
            }
            obj.message.all = true;
            for (const id in this.devices.keys()) {
              void ((_a = this.devices.get(id)) == null ? void 0 : _a.message(obj));
            }
          } else {
            const ip = (0, import_helper.forbidden_ip)(obj.message.name, this.FORBIDDEN_CHARS);
            obj.message.all = false;
            void ((_b = this.devices.get(ip)) == null ? void 0 : _b.message(obj));
          }
        } else {
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, { error: "Missing object Id" }, obj.callback);
          }
        }
      } else if (obj.command === "sendDirect") {
        if (obj.message.name === "all") {
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, { error: "Multi callback is not possible!" }, obj.callback);
          }
          obj.message.all = true;
          for (const id in this.devices.keys()) {
            void ((_c = this.devices.get(id)) == null ? void 0 : _c.messageDirect(obj));
          }
        } else {
          const ip = (0, import_helper.forbidden_ip)(obj.message.name, this.FORBIDDEN_CHARS);
          obj.message.all = false;
          void ((_d = this.devices.get(ip)) == null ? void 0 : _d.messageDirect(obj));
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
  async getUpdateData(ip, data) {
    this.log.debug(ip);
    this.log.debug(JSON.stringify(data));
    const device = this.devicesStatus.find((dev) => dev.ip === ip);
    if (device) {
      device.status = data;
    }
    const status = this.devicesStatus.find((dev) => dev.status);
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
  module.exports = (options) => new LgWebos(options);
} else {
  (() => new LgWebos())();
}
//# sourceMappingURL=main.js.map
