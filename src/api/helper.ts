import wol from "wake_on_lan";
import WebSocket from "ws";

/**
 * create ws class
 *
 * @param options WebSocket.ClientOptions
 * @returns websocket class
 */
export function webSocketClass(options: WebSocket.ClientOptions): any {
    return class extends WebSocket {
        constructor(url: string, protocols: string) {
            super(url, protocols, options);
            this.on("error", () => {
                // Nothing
            });
        }
    };
}

/**
 * Wake on lan
 *
 * @param macAddress MAC address
 * @param address IP Address
 * @returns result
 */
export function promisedWolAddress(macAddress: string, address: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        wol.wake(macAddress, { address, port: 9 }, (error: any) => {
            if (error) {
                reject;
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Wake on lan
 *
 * @param macAddress MAC address
 * @returns result
 */
export function promisedWol(macAddress: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        wol.wake(macAddress, (error: any) => {
            if (error) {
                reject;
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Replace object name
 *
 * @param ip IP Address
 * @param forbidden RegEx
 * @returns object name
 */
export function forbidden_ip(ip: string, forbidden: RegExp): string {
    return `${ip.replace(/[.]/gu, "_").replace(forbidden, "_")}`;
}

export enum Endpoint {
    GET_SERVICES = "api/getServiceList",
    GET_AUDIO_STATUS = "audio/getStatus",
    GET_AUDIO_MUTE = "audio/getMute",
    GET_VOLUME = "audio/getVolume",
    GET_APPS = "com.webos.applicationManager/listLaunchPoints",
    GET_APPS_ALL = "com.webos.applicationManager/listApps",
    GET_APP_STATUS = "com.webos.service.appstatus/getAppStatus",
    GET_APP_INFO = "com.webos.applicationManager/getAppInfo", //"payload":{"id": app_id}
    GET_SOFTWARE_INFO = "com.webos.service.update/getCurrentSWInformation",
    GET_CURRENT_APP_INFO = "com.webos.applicationManager/getForegroundAppInfo",
    GET_APP_STATE = "system.launcher/getAppState", //"payload":{"id": appId}
    GET_SYSTEM_INFO = "system/getSystemInfo",
    GET_SYSTEM_SETTINGS = "settings/getSystemSettings",
    GET_TV_CHANNELS = "tv/getChannelList",
    GET_CHANNEL_INFO = "tv/getChannelProgramInfo", //payload":{"channelId":channelId}
    GET_CURRENT_CHANNEL = "tv/getCurrentChannel",
    GET_CURRENT_PROGRAM_INFO = "tv/getChannelCurrentProgramInfo",
    GET_ACR_TOKEN = "tv/getACRAuthToken",
    GET_INPUTS = "tv/getExternalInputList",
    GET_CALIBRATION = "externalpq/getExternalPqData",
    GET_SOUND_OUTPUT = "com.webos.service.apiadapter/audio/getSoundOutput",
    GET_POWER_STATE = "com.webos.service.tvpower/power/getPowerState",
    GET_CONFIGS = "config/getConfigs",
    GET_TV_TIME = "com.webos.service.tv.time/getCurrentTime",
    GET_3D_STATUS = "com.webos.service.tv.display/get3DStatus",
    SET_3D_ON = "com.webos.service.tv.display/set3DOn",
    SET_3D_OFF = "com.webos.service.tv.display/set3DOff",
    SET_CHANNEL = "tv/openChannel", //payload":{"channelId": channelId}
    SET_INPUT = "tv/switchInput", //payload":{"inputId": value}
    SET_VOLUME = "audio/setVolume", //payload":{"volume":value}
    SET_MUTE = "audio/setMute", //"payload": {"mute": true/false}
    SET_SYSTEM_SETTINGS = "settings/setSystemSettings",
    SET_BUTTON = "button",
    SET_PIN = "pairing/setPin",
    SECURE = "com.webos.service.secondscreen.gateway/test/secure",
    CURSOR_DRAG = "move",
    CURSOR_SCROLL = "scroll",
    CURSOR_CLICK = "click",
    VOLUME_UP = "audio/volumeUp",
    VOLUME_DOWN = "audio/volumeDown",
    LAUNCH_APP = "com.webos.applicationManager/launch",
    SEND_ENTER = "com.webos.service.ime/sendEnterKey",
    SEND_DELETE = "com.webos.service.ime/deleteCharacters", //"payload":{"count":count}
    INSERT_TEXT = "com.webos.service.ime/insertText", //"payload":{"text":text, "replace": true/false}
    SEND_REGISTER = "com.webos.service.ime/registerRemoteKeyboard",
    MEDIA_PLAY = "media.controls/play",
    MEDIA_STOP = "media.controls/stop",
    MEDIA_PAUSE = "media.controls/pause",
    MEDIA_REWIND = "media.controls/rewind",
    MEDIA_OPEN = "media.viewer/open",
    MEDIA_FAST_FORWARD = "media.controls/fastForward",
    MEDIA_CLOSE = "media.viewer/close",
    POWER_OFF = "system/turnOff",
    POWER_ON = "system/turnOn",
    CREATE_TOAST = "system.notifications/createToast",
    CLOSE_TOAST = "system.notifications/closeToast",
    CREATE_ALERT = "system.notifications/createAlert",
    CLOSE_ALERT = "system.notifications/closeAlert",
    LAUNCHER_CLOSE = "system.launcher/close",
    LAUNCH = "system.launcher/launch", //"payload":{"id":appId}
    OPEN = "system.launcher/open", //"payload":{"target": url}
    TV_CHANNEL_DOWN = "tv/channelDown",
    TV_CHANNEL_UP = "tv/channelUp",
    TAKE_SCREENSHOT = "tv/executeOneShot",
    CLOSE_WEB_APP = "webapp/closeWebApp",
    CONNECT_WEB_APP = "webapp/connectToApp",
    PIN_IS_WEB_APP = "webapp/isWebAppPinned",
    LAUNCH_WEB_APP = "webapp/launchWebApp",
    PIN_WEB_APP = "webapp/pinWebApp",
    PIN_REMOVE_WEB_APP = "webapp/removePinnedWebApp",
    INPUT_SOCKET = "com.webos.service.networkinput/getPointerInputSocket",
    CALIBRATION = "externalpq/setExternalPqData",
    REQUEST_REBOOT = "com.webos.service.devicereset/requestReboot",
    CHANGE_SOUND_OUTPUT = "com.webos.service.apiadapter/audio/changeSoundOutput", //"payload":{"output": value}
    TURN_OFF_SCREEN = "com.webos.service.tvpower/power/turnOffScreen", //"payload":{"standbyMode": "active"}
    TURN_ON_SCREEN = "com.webos.service.tvpower/power/turnOnScreen", //"payload":{"standbyMode": "active"}
    TURN_OFF_SCREEN_OD = "com.webos.service.tv.power/turnOffScreen", //"payload":{"standbyMode": "active"}
    TURN_ON_SCREEN_OD = "com.webos.service.tv.power/turnOnScreen", //"payload":{"standbyMode": "active"}
    LIST_DEVICES = "com.webos.service.attachedstoragemanager/listDevices", //"payload":{"deviceType": ["dms"]}
    LUNA_SET_CONFIGS = "com.webos.service.config/setConfigs",
    LUNA_SET_SYSTEM_SETTINGS = "com.webos.settingsservice/setSystemSettings",
    LUNA_TURN_ON_SCREEN_SAVER = "com.webos.service.tvpower/power/turnOnScreenSaver",
    LUNA_SET_PQ_PROPERTIES = "com.webos.service.pqcontroller/setProperties",
    LUNA_REBOOT_TV = "com.webos.service.tvpower/power/reboot",
    LUNA_REBOOT_TV_OD = "com.webos.service.tv.power/reboot",
    LUNA_SHOW_INPUT_PICKER = "com.webos.surfacemanager/showInputPicker",
    LUNA_SET_DEVICE_INFO = "com.webos.service.eim/setDeviceInfo",
    LUNA_EJECT_DEVICE = "com.webos.service.attachedstoragemanager/ejectDevice", //"payload":{"deviceId": device_id}
    LUNA_SET_TPC = "com.webos.service.oledepl/setTemporalPeakControl",
    LUNA_SET_GSR = "com.webos.service.oledepl/setGlobalStressReduction",
    LUNA_SET_WHITE_BALANCE = "com.webos.service.pqcontroller/setWhiteBalance",
    LUNA_SET_CURVE_PRESET = "com.webos.service.rollingscreen/changeCurve",
    LUNA_ADJUST_CURVE_PRESET = "com.webos.service.rollingscreen/updateCurvature",
}

export const errors: string[] = [
    "400 unknown message type",
    "401 insufficient permissions",
    "403 access denied",
    "403 Error: User rejected pairing",
    "404 no such service or method",
    "500 Application error",
];

export const buttons: string[] = [
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
    "9",
];
