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
var helper_exports = {};
__export(helper_exports, {
  Endpoint: () => Endpoint,
  buttons: () => buttons,
  errors: () => errors,
  forbidden_ip: () => forbidden_ip,
  promisedWol: () => promisedWol,
  promisedWolAddress: () => promisedWolAddress,
  webSocketClass: () => webSocketClass
});
module.exports = __toCommonJS(helper_exports);
var import_wake_on_lan = __toESM(require("wake_on_lan"));
var import_ws = __toESM(require("ws"));
function webSocketClass(options) {
  return class extends import_ws.default {
    constructor(url, protocols) {
      super(url, protocols, options);
      this.on("error", () => {
      });
    }
  };
}
function promisedWolAddress(macAddress, address) {
  return new Promise((resolve, reject) => {
    import_wake_on_lan.default.wake(macAddress, { address, port: 9 }, (error) => {
      if (error) {
        reject;
      } else {
        resolve(true);
      }
    });
  });
}
function promisedWol(macAddress) {
  return new Promise((resolve, reject) => {
    import_wake_on_lan.default.wake(macAddress, (error) => {
      if (error) {
        reject;
      } else {
        resolve(true);
      }
    });
  });
}
function forbidden_ip(ip, forbidden) {
  return `${ip.replace(/[.]/gu, "_").replace(forbidden, "_")}`;
}
var Endpoint = /* @__PURE__ */ ((Endpoint2) => {
  Endpoint2["GET_SERVICES"] = "api/getServiceList";
  Endpoint2["GET_AUDIO_STATUS"] = "audio/getStatus";
  Endpoint2["GET_AUDIO_MUTE"] = "audio/getMute";
  Endpoint2["GET_VOLUME"] = "audio/getVolume";
  Endpoint2["GET_APPS"] = "com.webos.applicationManager/listLaunchPoints";
  Endpoint2["GET_APPS_ALL"] = "com.webos.applicationManager/listApps";
  Endpoint2["GET_APP_STATUS"] = "com.webos.service.appstatus/getAppStatus";
  Endpoint2["GET_APP_INFO"] = "com.webos.applicationManager/getAppInfo";
  Endpoint2["GET_SOFTWARE_INFO"] = "com.webos.service.update/getCurrentSWInformation";
  Endpoint2["GET_CURRENT_APP_INFO"] = "com.webos.applicationManager/getForegroundAppInfo";
  Endpoint2["GET_APP_STATE"] = "system.launcher/getAppState";
  Endpoint2["GET_SYSTEM_INFO"] = "system/getSystemInfo";
  Endpoint2["GET_SYSTEM_SETTINGS"] = "settings/getSystemSettings";
  Endpoint2["GET_TV_CHANNELS"] = "tv/getChannelList";
  Endpoint2["GET_CHANNEL_INFO"] = "tv/getChannelProgramInfo";
  Endpoint2["GET_CURRENT_CHANNEL"] = "tv/getCurrentChannel";
  Endpoint2["GET_CURRENT_PROGRAM_INFO"] = "tv/getChannelCurrentProgramInfo";
  Endpoint2["GET_ACR_TOKEN"] = "tv/getACRAuthToken";
  Endpoint2["GET_INPUTS"] = "tv/getExternalInputList";
  Endpoint2["GET_CALIBRATION"] = "externalpq/getExternalPqData";
  Endpoint2["GET_SOUND_OUTPUT"] = "com.webos.service.apiadapter/audio/getSoundOutput";
  Endpoint2["GET_POWER_STATE"] = "com.webos.service.tvpower/power/getPowerState";
  Endpoint2["GET_CONFIGS"] = "config/getConfigs";
  Endpoint2["GET_TV_TIME"] = "com.webos.service.tv.time/getCurrentTime";
  Endpoint2["GET_3D_STATUS"] = "com.webos.service.tv.display/get3DStatus";
  Endpoint2["SET_3D_ON"] = "com.webos.service.tv.display/set3DOn";
  Endpoint2["SET_3D_OFF"] = "com.webos.service.tv.display/set3DOff";
  Endpoint2["SET_CHANNEL"] = "tv/openChannel";
  Endpoint2["SET_INPUT"] = "tv/switchInput";
  Endpoint2["SET_VOLUME"] = "audio/setVolume";
  Endpoint2["SET_MUTE"] = "audio/setMute";
  Endpoint2["SET_SYSTEM_SETTINGS"] = "settings/setSystemSettings";
  Endpoint2["SET_BUTTON"] = "button";
  Endpoint2["SET_PIN"] = "pairing/setPin";
  Endpoint2["SECURE"] = "com.webos.service.secondscreen.gateway/test/secure";
  Endpoint2["CURSOR_DRAG"] = "move";
  Endpoint2["CURSOR_SCROLL"] = "scroll";
  Endpoint2["CURSOR_CLICK"] = "click";
  Endpoint2["VOLUME_UP"] = "audio/volumeUp";
  Endpoint2["VOLUME_DOWN"] = "audio/volumeDown";
  Endpoint2["LAUNCH_APP"] = "com.webos.applicationManager/launch";
  Endpoint2["SEND_ENTER"] = "com.webos.service.ime/sendEnterKey";
  Endpoint2["SEND_DELETE"] = "com.webos.service.ime/deleteCharacters";
  Endpoint2["INSERT_TEXT"] = "com.webos.service.ime/insertText";
  Endpoint2["SEND_REGISTER"] = "com.webos.service.ime/registerRemoteKeyboard";
  Endpoint2["MEDIA_PLAY"] = "media.controls/play";
  Endpoint2["MEDIA_STOP"] = "media.controls/stop";
  Endpoint2["MEDIA_PAUSE"] = "media.controls/pause";
  Endpoint2["MEDIA_REWIND"] = "media.controls/rewind";
  Endpoint2["MEDIA_OPEN"] = "media.viewer/open";
  Endpoint2["MEDIA_FAST_FORWARD"] = "media.controls/fastForward";
  Endpoint2["MEDIA_CLOSE"] = "media.viewer/close";
  Endpoint2["POWER_OFF"] = "system/turnOff";
  Endpoint2["POWER_ON"] = "system/turnOn";
  Endpoint2["CREATE_TOAST"] = "system.notifications/createToast";
  Endpoint2["CLOSE_TOAST"] = "system.notifications/closeToast";
  Endpoint2["CREATE_ALERT"] = "system.notifications/createAlert";
  Endpoint2["CLOSE_ALERT"] = "system.notifications/closeAlert";
  Endpoint2["LAUNCHER_CLOSE"] = "system.launcher/close";
  Endpoint2["LAUNCH"] = "system.launcher/launch";
  Endpoint2["OPEN"] = "system.launcher/open";
  Endpoint2["TV_CHANNEL_DOWN"] = "tv/channelDown";
  Endpoint2["TV_CHANNEL_UP"] = "tv/channelUp";
  Endpoint2["TAKE_SCREENSHOT"] = "tv/executeOneShot";
  Endpoint2["CLOSE_WEB_APP"] = "webapp/closeWebApp";
  Endpoint2["CONNECT_WEB_APP"] = "webapp/connectToApp";
  Endpoint2["PIN_IS_WEB_APP"] = "webapp/isWebAppPinned";
  Endpoint2["LAUNCH_WEB_APP"] = "webapp/launchWebApp";
  Endpoint2["PIN_WEB_APP"] = "webapp/pinWebApp";
  Endpoint2["PIN_REMOVE_WEB_APP"] = "webapp/removePinnedWebApp";
  Endpoint2["INPUT_SOCKET"] = "com.webos.service.networkinput/getPointerInputSocket";
  Endpoint2["CALIBRATION"] = "externalpq/setExternalPqData";
  Endpoint2["REQUEST_REBOOT"] = "com.webos.service.devicereset/requestReboot";
  Endpoint2["CHANGE_SOUND_OUTPUT"] = "com.webos.service.apiadapter/audio/changeSoundOutput";
  Endpoint2["TURN_OFF_SCREEN"] = "com.webos.service.tvpower/power/turnOffScreen";
  Endpoint2["TURN_ON_SCREEN"] = "com.webos.service.tvpower/power/turnOnScreen";
  Endpoint2["TURN_OFF_SCREEN_OD"] = "com.webos.service.tv.power/turnOffScreen";
  Endpoint2["TURN_ON_SCREEN_OD"] = "com.webos.service.tv.power/turnOnScreen";
  Endpoint2["LIST_DEVICES"] = "com.webos.service.attachedstoragemanager/listDevices";
  Endpoint2["LUNA_SET_CONFIGS"] = "com.webos.service.config/setConfigs";
  Endpoint2["LUNA_SET_SYSTEM_SETTINGS"] = "com.webos.settingsservice/setSystemSettings";
  Endpoint2["LUNA_TURN_ON_SCREEN_SAVER"] = "com.webos.service.tvpower/power/turnOnScreenSaver";
  Endpoint2["LUNA_SET_PQ_PROPERTIES"] = "com.webos.service.pqcontroller/setProperties";
  Endpoint2["LUNA_REBOOT_TV"] = "com.webos.service.tvpower/power/reboot";
  Endpoint2["LUNA_REBOOT_TV_OD"] = "com.webos.service.tv.power/reboot";
  Endpoint2["LUNA_SHOW_INPUT_PICKER"] = "com.webos.surfacemanager/showInputPicker";
  Endpoint2["LUNA_SET_DEVICE_INFO"] = "com.webos.service.eim/setDeviceInfo";
  Endpoint2["LUNA_EJECT_DEVICE"] = "com.webos.service.attachedstoragemanager/ejectDevice";
  Endpoint2["LUNA_SET_TPC"] = "com.webos.service.oledepl/setTemporalPeakControl";
  Endpoint2["LUNA_SET_GSR"] = "com.webos.service.oledepl/setGlobalStressReduction";
  Endpoint2["LUNA_SET_WHITE_BALANCE"] = "com.webos.service.pqcontroller/setWhiteBalance";
  Endpoint2["LUNA_SET_CURVE_PRESET"] = "com.webos.service.rollingscreen/changeCurve";
  Endpoint2["LUNA_ADJUST_CURVE_PRESET"] = "com.webos.service.rollingscreen/updateCurvature";
  return Endpoint2;
})(Endpoint || {});
const errors = [
  "400 unknown message type",
  "401 insufficient permissions",
  "403 access denied",
  "403 Error: User rejected pairing",
  "404 no such service or method",
  "500 Application error"
];
const buttons = [
  "LEFT",
  "RIGHT",
  "UP",
  "DOWN",
  "RED",
  "GREEN",
  "YELLOW",
  "BLUE",
  "CHANNELUP",
  "CHANNELDOWN",
  "VOLUMEUP",
  "VOLUMEDOWN",
  "PLAY",
  "PAUSE",
  "STOP",
  "REWIND",
  "FASTFORWARD",
  "ASTERISK",
  "BACK",
  "EXIT",
  "ENTER",
  "AMAZON",
  "NETFLIX",
  "3D_MODE",
  "AD",
  "ADVANCE_SETTING",
  "ALEXA",
  "AMAZON",
  "ASPECT_RATIO",
  "CC",
  "DASH",
  "EMANUAL",
  "EZPIC",
  "EZ_ADJUST",
  "EYE_Q",
  "GUIDE",
  "HCEC",
  "HOME",
  "INFO",
  "IN_START",
  "INPUT_HUB",
  "IVI",
  "LIST",
  "LIVE_ZOOM",
  "MAGNIFIER_ZOOM",
  "MENU",
  "MUTE",
  "MYAPPS",
  "NETFLIX",
  "POWER",
  "PROGRAM",
  "QMENU",
  "RECENT",
  "RECLIST",
  "RECORD",
  "SAP",
  "SCREEN_REMOTE",
  "SEARCH",
  "SOCCER",
  "TELETEXT",
  "TEXTOPTION",
  "TIMER",
  "TV",
  "TWIN",
  "UPDOWN",
  "USP",
  "YANDEX",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Endpoint,
  buttons,
  errors,
  forbidden_ip,
  promisedWol,
  promisedWolAddress,
  webSocketClass
});
//# sourceMappingURL=helper.js.map
