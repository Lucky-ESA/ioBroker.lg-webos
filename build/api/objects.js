"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var objects_exports = {};
__export(objects_exports, {
  creatObjects: () => creatObjects
});
module.exports = __toCommonJS(objects_exports);
var import_node_buffer = require("node:buffer");
var import_request = require("./request");
class creatObjects {
  /**
   * @param device States (Datapoints)
   * @param iob ioBroker.Adapter
   */
  constructor(device, iob) {
    this.device = device;
    this.iob = iob;
    this.getRequest = new import_request.axoisRrequest();
    this.dev = device;
    this.adapter = iob;
    if (this.dev.dp == void 0) {
      this.adapter.log.error(`Missing Object ID!!!!`);
    }
    this.firstStart = true;
  }
  dev;
  adapter;
  getRequest;
  firstStart;
  states = {};
  /**
   * Create System Pictures Settings
   *
   * @param val Pictures Settings
   */
  async createSettings(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let common;
      if (this.firstStart) {
        this.firstStart = false;
        common = {
          name: {
            en: "Settings",
            de: "Einstellungen",
            ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            pt: "Configura\xE7\xF5es",
            nl: "Setting",
            fr: "R\xE9glages",
            it: "Impostazioni impostazioni",
            es: "Ajustes",
            pl: "Setting",
            uk: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
            "zh-cn": "\u786E\u5B9A"
          },
          desc: "Create by Adapter",
          icon: "img/settings.png"
        };
        await this.createDataPoint(`${this.dev.dp}.remote.settings`, common, "channel", null, null, null);
      }
      for (const attribute in val.payload.settings) {
        if (attribute == "brightness") {
          common = {
            type: "number",
            role: "value.brightness",
            name: {
              en: "Brightness",
              de: "Helligkeit",
              ru: "\u042F\u0440\u043A\u043E\u0441\u0442\u044C",
              pt: "Brilho",
              nl: "Helderheid",
              fr: "Luminosit\xE9",
              it: "Luminosit\xE0",
              es: "Brillo",
              pl: "Jasno\u015B\u0107",
              uk: "\u042F\u0441\u043A\u0440\u0430\u0432\u0456\u0441\u0442\u044C",
              "zh-cn": "\u4EAE\u5EA6"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            step: 1,
            max: 100,
            min: 0,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.brightness`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "backlight") {
          common = {
            type: "number",
            role: "value",
            name: {
              en: "Backlight",
              de: "Hintergrundbeleuchtung",
              ru: "\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430",
              pt: "Luz de fundo",
              nl: "Achtergrondverlichting",
              fr: "R\xE9tro\xE9clairage",
              it: "Retroilluminazione",
              es: "Iluminar desde el fondo",
              pl: "Pod\u015Bwietlenie",
              uk: "\u041F\u0456\u0434\u0441\u0432\u0456\u0447\u0443\u0432\u0430\u043D\u043D\u044F",
              "zh-cn": "\u80CC\u5149"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            step: 1,
            max: 100,
            min: 0,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.backlight`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "contrast") {
          common = {
            type: "number",
            role: "value",
            name: {
              en: "Contrast",
              de: "Kontrast",
              ru: "\u041A\u043E\u043D\u0442\u0440\u0430\u0441\u0442",
              pt: "Contraste",
              nl: "Contrast",
              fr: "Contraste",
              it: "Contrasto",
              es: "Contraste",
              pl: "Kontrast",
              uk: "\u041A\u043E\u043D\u0442\u0440\u0430\u0441\u0442",
              "zh-cn": "\u5BF9\u6BD4"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            step: 1,
            max: 100,
            min: 0,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.contrast`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "color") {
          common = {
            type: "number",
            role: "value",
            name: {
              en: "Color",
              de: "Farbe",
              ru: "\u0426\u0432\u0435\u0442",
              pt: "Cor",
              nl: "Kleur",
              fr: "Couleur",
              it: "Colore",
              es: "Color",
              pl: "Kolor",
              uk: "\u041A\u043E\u043B\u0456\u0440",
              "zh-cn": "\u989C\u8272"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            step: 1,
            max: 100,
            min: 0,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.color`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "pictureMode") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Picture Mode",
              de: "Bildmodus",
              ru: "\u0420\u0435\u0436\u0438\u043C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
              pt: "Modo de imagem",
              nl: "Fotomodus",
              fr: "Mode image",
              it: "Modalit\xE0 immagine",
              es: "Modo de imagen",
              pl: "Tryb obrazu",
              uk: "\u0420\u0435\u0436\u0438\u043C \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F",
              "zh-cn": "\u56FE\u7247\u6A21\u5F0F"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            states: {
              cinema: "Cinema",
              eco: "ECO",
              expert1: "Expert 1",
              expert2: "Expert 2",
              game: "Gaming",
              hdrCinema: "HDR Cinema",
              hdrCinemaBright: "HDR Cinema Bright",
              hdrEco: "HDR ECO",
              hdrGame: "HDR Game",
              hdrPersonalized: "HDR Personalized",
              hdrStandard: "HDR Standard",
              hdrVivid: "HDR Vivid",
              movie: "Movie",
              natural: "Natural",
              normal: "Normal",
              personalized: "Personalized",
              sports: "Sport",
              vivid: "Vivid"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.pictureMode`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "smoothGradation") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Smooth Gradation",
              de: "Sanfter \xDCbergang",
              ru: "\u041F\u043B\u0430\u0432\u043D\u044B\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434",
              pt: "Gradua\xE7\xE3o suave",
              nl: "Vloeiende overgang",
              fr: "D\xE9grad\xE9 lisse",
              it: "Gradazione uniforme",
              es: "Gradaci\xF3n suave",
              pl: "P\u0142ynna gradacja",
              uk: "\u041F\u043B\u0430\u0432\u043D\u0430 \u0433\u0440\u0430\u0434\u0430\u0446\u0456\u044F",
              "zh-cn": "\u5E73\u6ED1\u6E10\u53D8"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              low: "Low",
              medium: "Medium",
              high: "High",
              auto: "Auto"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.smoothGradation`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "mpegNoiseReduction") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "MPEG Noise Reduction",
              de: "MPEG-Rauschunterdr\xFCckung",
              ru: "\u0421\u043D\u0438\u0436\u0435\u043D\u0438\u0435 \u0448\u0443\u043C\u0430 MPEG",
              pt: "Redu\xE7\xE3o de ru\xEDdo MPEG",
              nl: "MPEG-ruisonderdrukking",
              fr: "R\xE9duction du bruit MPEG",
              it: "Riduzione del rumore MPEG",
              es: "Reducci\xF3n de ruido MPEG",
              pl: "Redukcja szum\xF3w MPEG",
              uk: "\u0417\u043C\u0435\u043D\u0448\u0435\u043D\u043D\u044F \u0448\u0443\u043C\u0443 MPEG",
              "zh-cn": "MPEG\u964D\u566A"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              low: "Low",
              medium: "Medium",
              high: "High",
              auto: "Auto"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.mpegNoiseReduction`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "deviceName") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Device Name",
              de: "Ger\xE4tename",
              ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",
              pt: "Nome do dispositivo",
              nl: "Apparaatnaam",
              fr: "Nom de l'appareil",
              it: "Nome del dispositivo",
              es: "Nombre del dispositivo",
              pl: "Nazwa urz\u0105dzenia",
              uk: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u044E",
              "zh-cn": "\u8BBE\u5907\u540D\u79F0"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: ""
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.deviceName`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "wolwowlOnOff") {
          common = {
            type: "boolean",
            role: "switch",
            name: {
              en: "Wake on lan On/Off",
              de: "Wake-on-LAN ein/aus",
              ru: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435/\u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u043F\u0440\u043E\u0431\u0443\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0439 \u0441\u0435\u0442\u0438",
              pt: "Wake on lan Ligado/Desligado",
              nl: "Wake-on-LAN aan/uit",
              fr: "Activation/d\xE9sactivation du Wake on LAN",
              it: "Wake on LAN attivato/disattivato",
              es: "Activaci\xF3n/desactivaci\xF3n de Wake on LAN",
              pl: "W\u0142\u0105cz/wy\u0142\u0105cz funkcj\u0119 Wake on LAN",
              uk: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043D\u044F/\u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0431\u0443\u0434\u0436\u0435\u043D\u043D\u044F \u043F\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0456\u0439 \u043C\u0435\u0440\u0435\u0436\u0456",
              "zh-cn": "\u7F51\u7EDC\u5524\u9192\u529F\u80FD\u5F00/\u5173"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: false
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.wolwowlOnOff`,
            common,
            "state",
            val.payload.settings[attribute] == "true" ? true : false,
            null,
            null
          );
        } else if (attribute == "energySaving") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Energy Saving",
              de: "Energiesparen",
              ru: "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0435",
              pt: "Economia de energia",
              nl: "Energiebesparing",
              fr: "\xC9conomies d'\xE9nergie",
              it: "Risparmio energetico",
              es: "Ahorro de energ\xEDa",
              pl: "Oszcz\u0119dno\u015B\u0107 energii",
              uk: "\u0415\u043D\u0435\u0440\u0433\u043E\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F",
              "zh-cn": "\u8282\u80FD"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "auto",
            states: {
              auto: "Auto",
              off: "Off",
              min: "Minimum",
              med: "Medium",
              max: "Maximum"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.energySaving`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "sharpness") {
          common = {
            type: "number",
            role: "value",
            name: {
              en: "Sharpness",
              de: "Sch\xE4rfe",
              ru: "\u041E\u0441\u0442\u0440\u043E\u0442\u0430",
              pt: "Nitidez",
              nl: "Scherpte",
              fr: "Acuit\xE9",
              it: "Nitidezza",
              es: "Nitidez",
              pl: "Ostro\u015B\u0107",
              uk: "\u0420\u0456\u0437\u043A\u0456\u0441\u0442\u044C",
              "zh-cn": "\u6E05\u6670\u5EA6"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            max: 50,
            min: 0,
            step: 1,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.sharpness`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "dynamicContrast") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Dynamic contrast",
              de: "Dynamischer Kontrast",
              ru: "\u0414\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442",
              pt: "Contraste din\xE2mico",
              nl: "Dynamisch contrast",
              fr: "Contraste dynamique",
              it: "Contrasto dinamico",
              es: "Contraste din\xE1mico",
              pl: "Kontrast dynamiczny",
              uk: "\u0414\u0438\u043D\u0430\u043C\u0456\u0447\u043D\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442",
              "zh-cn": "\u52A8\u6001\u5BF9\u6BD4"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              low: "Low",
              medium: "Medium",
              high: "High"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.dynamicContrast`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "peakBrightness") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Peak brightness",
              de: "Spitzenhelligkeit",
              ru: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u044F\u0440\u043A\u043E\u0441\u0442\u044C",
              pt: "Brilho m\xE1ximo",
              nl: "Maximale helderheid",
              fr: "luminosit\xE9 maximale",
              it: "luminosit\xE0 massima",
              es: "Brillo m\xE1ximo",
              pl: "Maksymalna jasno\u015B\u0107",
              uk: "\u041F\u0456\u043A\u043E\u0432\u0430 \u044F\u0441\u043A\u0440\u0430\u0432\u0456\u0441\u0442\u044C",
              "zh-cn": "\u5CF0\u503C\u4EAE\u5EA6"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              high: "High"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.peakBrightness`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "blackLevel") {
          common = {
            type: "string",
            role: "json",
            name: {
              en: "Black level",
              de: "Schwarzpegel",
              ru: "\u0427\u0435\u0440\u043D\u044B\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C",
              pt: "N\xEDvel preto",
              nl: "Zwartniveau",
              fr: "Niveau noir",
              it: "Livello del nero",
              es: "Nivel negro",
              pl: "Poziom czerni",
              uk: "\u0420\u0456\u0432\u0435\u043D\u044C \u0447\u043E\u0440\u043D\u043E\u0433\u043E",
              "zh-cn": "\u9ED1\u7535\u5E73"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "{}"
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.blackLevel`,
            common,
            "state",
            JSON.stringify(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "gamma") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Gamma",
              de: "Gamma",
              ru: "\u0413\u0430\u043C\u043C\u0430",
              pt: "Gama",
              nl: "Gamma",
              fr: "Gamma",
              it: "Gamma",
              es: "Gama",
              pl: "Gamma",
              uk: "\u0413\u0430\u043C\u043C\u0430",
              "zh-cn": "\u4F3D\u9A6C"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "medium",
            states: {
              low: "Low",
              medium: "Medium",
              high1: "High Level 1",
              high2: "High Level 2"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.gamma`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "motionEyeCare") {
          common = {
            type: "boolean",
            role: "switch",
            name: {
              en: "Motion eye Care",
              de: "Augenpflege",
              ru: "\u0423\u0445\u043E\u0434 \u0437\u0430 \u0433\u043B\u0430\u0437\u0430\u043C\u0438 \u043F\u0440\u0438 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0438",
              pt: "Cuidados com os olhos em movimento",
              nl: "Bewegingsoogverzorging",
              fr: "Soins oculaires en mouvement",
              it: "Cura degli occhi in movimento",
              es: "Cuidado ocular con movimiento",
              pl: "Opieka nad oczami w ruchu",
              uk: "\u0414\u043E\u0433\u043B\u044F\u0434 \u0437\u0430 \u043E\u0447\u0438\u043C\u0430 \u0437\u0430 \u0440\u0443\u0445\u043E\u043C",
              "zh-cn": "\u52A8\u6001\u773C\u79D1\u62A4\u7406"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: false
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.motionEyeCare`,
            common,
            "state",
            val.payload.settings[attribute] == "on" ? true : false,
            null,
            null
          );
        } else if (attribute == "colorGamut") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Color gamut",
              de: "Farbraum",
              ru: "\u0426\u0432\u0435\u0442\u043E\u0432\u0430\u044F \u0433\u0430\u043C\u043C\u0430",
              pt: "gama de cores",
              nl: "Kleurengamma",
              fr: "Gamme de couleurs",
              it: "Gamma di colori",
              es: "Gama de colores",
              pl: "Gama kolor\xF3w",
              uk: "\u041A\u043E\u043B\u0456\u0440\u043D\u0430 \u0433\u0430\u043C\u0430",
              "zh-cn": "\u8272\u57DF"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "auto",
            states: {
              auto: "Auto",
              native: "Native",
              wide: "Wide",
              extended: "Extended",
              dynamic: "Dynamic"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.colorGamut`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "hdrDynamicToneMapping") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "HDR dynamic tone mapping",
              de: "HDR-dynamisches Tone Mapping",
              ru: "HDR \u0434\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0442\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
              pt: "mapeamento de tons din\xE2mico HDR",
              nl: "HDR dynamische toonmapping",
              fr: "cartographie dynamique des tons HDR",
              it: "Mappatura dinamica dei toni HDR",
              es: "Mapeo din\xE1mico de tonos HDR",
              pl: "Dynamiczne mapowanie ton\xF3w HDR",
              uk: "\u0414\u0438\u043D\u0430\u043C\u0456\u0447\u043D\u0435 \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0442\u043E\u043D\u0456\u0432 HDR",
              "zh-cn": "HDR\u52A8\u6001\u8272\u8C03\u6620\u5C04"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              on: "On",
              HGIG: "HGIG"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.hdrDynamicToneMapping`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "realCinema") {
          common = {
            type: "boolean",
            role: "switch",
            name: {
              en: "Real cinema",
              de: "Echtes Kino",
              ru: "\u041D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435 \u043A\u0438\u043D\u043E",
              pt: "Cinema de verdade",
              nl: "Echte cinema",
              fr: "Le vrai cin\xE9ma",
              it: "Il vero cinema",
              es: "Cine real",
              pl: "Prawdziwe kino",
              uk: "\u0421\u043F\u0440\u0430\u0432\u0436\u043D\u0454 \u043A\u0456\u043D\u043E",
              "zh-cn": "\u771F\u5B9E\u7535\u5F71"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: false
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.realCinema`,
            common,
            "state",
            val.payload.settings[attribute] == "on" ? true : false,
            null,
            null
          );
        } else if (attribute == "tint") {
          common = {
            type: "number",
            role: "value",
            name: {
              en: "tint",
              de: "Farbton",
              ru: "\u043E\u0442\u0442\u0435\u043D\u043E\u043A",
              pt: "matiz",
              nl: "tint",
              fr: "teinte",
              it: "tinta",
              es: "tinte",
              pl: "odcie\u0144",
              uk: "\u0432\u0456\u0434\u0442\u0456\u043D\u043E\u043A",
              "zh-cn": "\u7740\u8272"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            max: 50,
            min: -50,
            step: 1,
            def: 0
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.tint`,
            common,
            "state",
            Number(val.payload.settings[attribute]),
            null,
            null
          );
        } else if (attribute == "noiseReduction") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Noise Reduction",
              de: "Ger\xE4uschreduzierung",
              ru: "\u0421\u043D\u0438\u0436\u0435\u043D\u0438\u0435 \u0443\u0440\u043E\u0432\u043D\u044F \u0448\u0443\u043C\u0430",
              pt: "Redu\xE7\xE3o de ru\xEDdo",
              nl: "Geluidsreductie",
              fr: "R\xE9duction du bruit",
              it: "Riduzione del rumore",
              es: "Reducci\xF3n de ruido",
              pl: "Redukcja ha\u0142asu",
              uk: "\u0417\u043C\u0435\u043D\u0448\u0435\u043D\u043D\u044F \u0448\u0443\u043C\u0443",
              "zh-cn": "\u964D\u566A"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              low: "Low",
              medium: "Medium",
              high: "High",
              auto: "Auto"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.noiseReduction`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "dynamicColor") {
          common = {
            type: "string",
            role: "state",
            name: {
              en: "Dynamic Color",
              de: "Dynamische Farben",
              ru: "\u0414\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0446\u0432\u0435\u0442",
              pt: "Cores din\xE2micas",
              nl: "Dynamische kleur",
              fr: "Couleur dynamique",
              it: "Colore dinamico",
              es: "Color din\xE1mico",
              pl: "Dynamiczny kolor",
              uk: "\u0414\u0438\u043D\u0430\u043C\u0456\u0447\u043D\u0438\u0439 \u043A\u043E\u043B\u0456\u0440",
              "zh-cn": "\u52A8\u6001\u8272\u5F69"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: "off",
            states: {
              off: "Off",
              low: "Low",
              medium: "Medium",
              high: "High",
              user: "User"
            }
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.dynamicColor`,
            common,
            "state",
            val.payload.settings[attribute],
            null,
            null
          );
        } else if (attribute == "eyeComfortMode") {
          common = {
            type: "boolean",
            role: "switch",
            name: {
              en: "Eye Comfort Mode",
              de: "Augenkomfortmodus",
              ru: "\u0420\u0435\u0436\u0438\u043C \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0430 \u0434\u043B\u044F \u0433\u043B\u0430\u0437",
              pt: "Modo de conforto para os olhos",
              nl: "Oogcomfortmodus",
              fr: "Mode confort des yeux",
              it: "Modalit\xE0 comfort per gli occhi",
              es: "Modo confort visual",
              pl: "Tryb komfortu dla oczu",
              uk: "\u0420\u0435\u0436\u0438\u043C \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0443 \u0434\u043B\u044F \u043E\u0447\u0435\u0439",
              "zh-cn": "\u62A4\u773C\u6A21\u5F0F"
            },
            desc: "Create by Adapter",
            read: true,
            write: true,
            def: false
          };
          await this.createDataPoint(
            `${this.dev.dp}.remote.settings.eyeComfortMode`,
            common,
            "state",
            val.payload.settings[attribute] == "on" ? true : false,
            null,
            null
          );
        }
      }
    }
  }
  /**
   * Create connection for pointer events
   */
  async createPointerConnection() {
    if (this.dev.dp != void 0) {
      const common = {
        type: "boolean",
        role: "indicator.connected",
        name: {
          en: "Pointer connection",
          de: "Zeigerverbindung",
          ru: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F",
          pt: "Conex\xE3o de ponteiro",
          nl: "Pointerverbinding",
          fr: "Connexion de pointeur",
          it: "Connessione del puntatore",
          es: "Conexi\xF3n de puntero",
          pl: "Po\u0142\u0105czenie wska\u017Anika",
          uk: "\u0417'\u0454\u0434\u043D\u0430\u043D\u043D\u044F \u0432\u043A\u0430\u0437\u0456\u0432\u043D\u0438\u043A\u0430",
          "zh-cn": "\u6307\u9488\u8FDE\u63A5"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.status.pointerConnection`, common, "state", false, null, null);
    }
  }
  /**
   * Create Info power state
   *
   * @param val Power State
   */
  async createPowerState(val) {
    if (this.dev.dp != void 0 && val.payload != void 0 && val.payload.state != void 0) {
      const common = {
        type: "string",
        role: "state",
        name: {
          en: "Power state",
          de: "Energiezustand",
          ru: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u0438",
          pt: "Estado de energia",
          nl: "Stroomtoestand",
          fr: "\xC9tat de puissance",
          it: "Stato di potenza",
          es: "Estado de potencia",
          pl: "Stan zasilania",
          uk: "\u0421\u0442\u0430\u043D \u0436\u0438\u0432\u043B\u0435\u043D\u043D\u044F",
          "zh-cn": "\u7535\u6E90\u72B6\u6001"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: "unknown",
        states: {
          unknown: "Unknown",
          Active: "is active",
          Suspend: "TV offline",
          "Screen Off": "Screen is off",
          "Screen Saver": "Screen saver is active"
        }
      };
      await this.createDataPoint(
        `${this.dev.dp}.status.powerState`,
        common,
        "state",
        val.payload.state,
        null,
        null
      );
    }
  }
  /**
   * Create App Buttons
   *
   * @param val App Name
   * @param url URL Icon
   */
  async createAppButton(val, url) {
    let icons;
    this.adapter.log.debug(JSON.stringify(url));
    if (url && this.dev.dp != void 0) {
      const oldFile = await this.adapter.fileExistsAsync(
        `${this.adapter.namespace}`,
        `${this.dev.dp}/${val}.png`
      );
      if (!oldFile) {
        const resp = await this.getRequest.get(url);
        icons = null;
        if (typeof resp === "object" && resp.data) {
          const file = url.split(".");
          const ext = file.pop();
          await this.adapter.writeFileAsync(
            `${this.adapter.namespace}`,
            `${this.dev.dp}/${val}.${ext}`,
            resp.data
          );
          const mime = import_node_buffer.Buffer.from(resp.data).toString("base64");
          icons = { icon: `data:${resp.data.mimeType};base64,${mime}` };
        } else {
          this.adapter.log.error(`ICON ERROR: ${JSON.stringify(resp)}`);
        }
      } else {
        const { file, mimeType } = await this.adapter.readFileAsync(
          this.adapter.namespace,
          `${this.dev.dp}/${val}.png`
        );
        if (file && mimeType) {
          const mime = import_node_buffer.Buffer.from(file).toString("base64");
          icons = { icon: `data:${mimeType};base64,${mime}` };
        }
      }
    }
    if (this.dev.dp != void 0) {
      let common;
      if (val === "amazon") {
        common = {
          role: "button",
          name: {
            en: "Opening Amazon Prime APP",
            de: "\xD6ffnen der Amazon Prime App",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Amazon Prime",
            pt: "Abrindo o aplicativo Amazon Prime",
            nl: "Amazon Prime-app openen",
            fr: "Ouverture de l'application Amazon Prime",
            it: "Apertura dell'APP Amazon Prime",
            es: "Abrir la aplicaci\xF3n Amazon Prime",
            pl: "Otwieranie aplikacji Amazon Prime",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 Amazon Prime",
            "zh-cn": "\u6253\u5F00\u4E9A\u9A6C\u900APrime\u5E94\u7528\u7A0B\u5E8F"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.amazon`, common, "state", false, null, null);
      } else if (val === "joyn") {
        common = {
          role: "button",
          name: {
            en: "Opening Joyn APP",
            de: "Joyn-App \xF6ffnen",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Joyn",
            pt: "Abrindo o aplicativo Joyn",
            nl: "De Joyn-app openen",
            fr: "Ouverture de l'application Joyn",
            it: "Apertura dell'APP Joyn",
            es: "Abrir la aplicaci\xF3n Joyn",
            pl: "Otwieranie aplikacji Joyn",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 Joyn",
            "zh-cn": "\u6253\u5F00 Joyn APP"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.joyn`, common, "state", false, null, null);
      } else if (val === "alexa") {
        common = {
          role: "button",
          name: {
            en: "Opening Amazon Alexa APP",
            de: "\xD6ffnen der Amazon Alexa App",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Amazon Alexa",
            pt: "Abrindo o aplicativo Amazon Alexa",
            nl: "Amazon Alexa-app openen",
            fr: "Ouverture de l'application Amazon Alexa",
            it: "Apertura dell'APP Amazon Alexa",
            es: "Abrir la aplicaci\xF3n Amazon Alexa",
            pl: "Otwieranie aplikacji Amazon Alexa",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 Amazon Alexa",
            "zh-cn": "\u6253\u5F00\u4E9A\u9A6C\u900A Alexa \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(
          `${this.dev.dp}.remote.keys.amazonAlexa`,
          common,
          "state",
          false,
          null,
          null
        );
      } else if (val === "youtube") {
        common = {
          role: "button",
          name: {
            en: "Opening Youtube APP",
            de: "YouTube-App \xF6ffnen",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F YouTube",
            pt: "Abrindo o aplicativo do YouTube",
            nl: "De YouTube-app openen",
            fr: "Ouverture de l'application YouTube",
            it: "Apertura dell'APP Youtube",
            es: "Abriendo la aplicaci\xF3n de Youtube",
            pl: "Otwieranie aplikacji Youtube",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438 YouTube",
            "zh-cn": "\u6253\u5F00 YouTube \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.youtube`, common, "state", false, null, null);
      } else if (val === "netflix") {
        common = {
          role: "button",
          name: {
            en: "Opening Netflix APP",
            de: "Netflix-App \xF6ffnen",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Netflix",
            pt: "Abrindo o aplicativo da Netflix",
            nl: "De Netflix-app openen",
            fr: "Ouverture de l'application Netflix",
            it: "Apertura dell'APP Netflix",
            es: "Abrir la aplicaci\xF3n de Netflix",
            pl: "Otwieranie aplikacji Netflix",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438 Netflix",
            "zh-cn": "\u6253\u5F00 Netflix \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.netflix`, common, "state", false, null, null);
      } else if (val === "disney") {
        common = {
          role: "button",
          name: {
            en: "Opening Disney+ APP",
            de: "Disney+ App \xF6ffnen",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Disney+",
            pt: "Abrindo o aplicativo Disney+",
            nl: "Disney+ app openen",
            fr: "Ouverture de l'application Disney+",
            it: "Apertura dell'APP Disney+",
            es: "Abrir la aplicaci\xF3n Disney+",
            pl: "Otwieranie aplikacji Disney+",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443 Disney+",
            "zh-cn": "\u6253\u5F00 Disney+ \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.disneyPlus`, common, "state", false, null, null);
      } else if (val === "rtl") {
        common = {
          role: "button",
          name: {
            en: "Opening RTL+ APP",
            de: "\xD6ffnen der RTL+-App",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F RTL+",
            pt: "Abrindo o aplicativo RTL+",
            nl: "De RTL+ app openen",
            fr: "Ouverture de l'application RTL+",
            it: "Apertura dell'APP RTL+",
            es: "Abrir la aplicaci\xF3n RTL+",
            pl: "Otwieranie aplikacji RTL+",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438 RTL+",
            "zh-cn": "\u6253\u5F00 RTL+ \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.rtlPlus`, common, "state", false, null, null);
      } else if (val === "apple") {
        common = {
          role: "button",
          name: {
            en: "Opening Apple-TV APP",
            de: "\xD6ffnen der Apple TV App",
            ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F Apple TV",
            pt: "Abrindo o aplicativo Apple TV",
            nl: "De Apple TV-app openen",
            fr: "Ouverture de l'application Apple TV",
            it: "Apertura dell'APP Apple-TV",
            es: "Abrir la aplicaci\xF3n Apple TV",
            pl: "Otwieranie aplikacji Apple TV",
            uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438 Apple TV",
            "zh-cn": "\u6253\u5F00 Apple TV \u5E94\u7528"
          },
          type: "boolean",
          read: false,
          write: true,
          desc: "Create by Adapter",
          def: false,
          ...icons
        };
        await this.createDataPoint(`${this.dev.dp}.remote.keys.appletv`, common, "state", false, null, null);
      }
    }
  }
  /**
   * Create Apps State
   *
   * @param val Apps
   */
  async createApps(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      this.states.unknown = "Unknown";
      for (const input of val.payload.apps) {
        if (!this.states[input.id]) {
          this.states[input.id] = input.title;
        }
      }
      const common = {
        type: "string",
        role: "state",
        name: {
          en: "Launch",
          de: "Start",
          ru: "\u0417\u0430\u043F\u0443\u0441\u043A",
          pt: "Lan\xE7ar",
          nl: "Launch",
          fr: "Lancement",
          it: "Lancio",
          es: "Lanzamiento",
          pl: "Pocz\u0105tek",
          uk: "\u0417\u0430\u043F\u0443\u0441\u043A",
          "zh-cn": "\u53D1\u5C04"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: "unknown",
        states: this.states
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.launch`, common, "state", "unknown", null, null);
    }
  }
  /**
   * Create Launch State
   *
   * @param val Launch
   */
  async createLaunch(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      this.states.unknown = "Unknown";
      for (const input of val.payload.launchPoints) {
        if (!this.states[input.id]) {
          this.states[input.id] = input.title;
        }
        if (input.id === "com.netrtl.tvnow") {
          await this.createAppButton("rtl", input.icon);
        } else if (input.id === "com.disney.disneyplus-prod") {
          await this.createAppButton("disney", input.icon);
        } else if (input.id === "youtube.leanback.v4") {
          await this.createAppButton("youtube", input.icon);
        } else if (input.id === "com.apple.appletv") {
          await this.createAppButton("apple", input.icon);
        } else if (input.id === "netflix") {
          await this.createAppButton("netflix", input.icon);
        } else if (input.id === "amazon") {
          await this.createAppButton("amazon", input.icon);
        } else if (input.id === "amazon.alexa.view") {
          await this.createAppButton("alexa", input.icon);
        } else if (input.id === "joyn") {
          await this.createAppButton("joyn", input.icon);
        }
      }
      const common = {
        type: "string",
        role: "state",
        name: {
          en: "Launch",
          de: "Start",
          ru: "\u0417\u0430\u043F\u0443\u0441\u043A",
          pt: "Lan\xE7ar",
          nl: "Launch",
          fr: "Lancement",
          it: "Lancio",
          es: "Lanzamiento",
          pl: "Pocz\u0105tek",
          uk: "\u0417\u0430\u043F\u0443\u0441\u043A",
          "zh-cn": "\u53D1\u5C04"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: "unknown",
        states: this.states
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.launch`, common, "state", "unknown", null, null);
    }
  }
  /**
   * Create System State
   *
   * @param val System
   */
  async createSystem(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let common;
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Product name",
          de: "Produktname",
          ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430",
          pt: "Nome do produto",
          nl: "Productnaam",
          fr: "Nom du produit",
          it: "Nome del prodotto",
          es: "Nombre del producto",
          pl: "Nazwa produktu",
          uk: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0443",
          "zh-cn": "\u4EA7\u54C1\u540D\u79F0"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.product_name`,
        common,
        "state",
        val.payload.product_name,
        null,
        null
      );
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Model name",
          de: "Modellname",
          ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043C\u043E\u0434\u0435\u043B\u0438",
          pt: "Nome do modelo",
          nl: "Modelnaam",
          fr: "Nom du mod\xE8le",
          it: "Nome del modello",
          es: "Nombre del modelo",
          pl: "Nazwa modelu",
          uk: "\u041D\u0430\u0437\u0432\u0430 \u043C\u043E\u0434\u0435\u043B\u0456",
          "zh-cn": "\u578B\u53F7\u540D\u79F0"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.model_name`,
        common,
        "state",
        val.payload.model_name,
        null,
        null
      );
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Country",
          de: "Land",
          ru: "\u0421\u0442\u0440\u0430\u043D\u0430",
          pt: "Pa\xEDs",
          nl: "Land",
          fr: "Pays",
          it: "Paese",
          es: "Pa\xEDs",
          pl: "Kraj",
          uk: "\u041A\u0440\u0430\u0457\u043D\u0430",
          "zh-cn": "\u56FD\u5BB6"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.country`,
        common,
        "state",
        val.payload.country,
        null,
        null
      );
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Language code",
          de: "Sprachcode",
          ru: "\u042F\u0437\u044B\u043A\u043E\u0432\u043E\u0439 \u043A\u043E\u0434",
          pt: "C\xF3digo de idioma",
          nl: "Taalcode",
          fr: "Code de langue",
          it: "Codice della lingua",
          es: "C\xF3digo de idioma",
          pl: "Kod j\u0119zyka",
          uk: "\u041A\u043E\u0434 \u043C\u043E\u0432\u0438",
          "zh-cn": "\u8BED\u8A00\u4EE3\u7801"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.language_code`,
        common,
        "state",
        val.payload.language_code,
        null,
        null
      );
      common = {
        type: "string",
        role: "state",
        name: {
          en: "MAC address",
          de: "MAC-Adresse",
          ru: "MAC-\u0430\u0434\u0440\u0435\u0441",
          pt: "Endere\xE7o MAC",
          nl: "MAC-adres",
          fr: "Adresse MAC",
          it: "indirizzo MAC",
          es: "Direcci\xF3n MAC",
          pl: "Adres MAC",
          uk: "MAC-\u0430\u0434\u0440\u0435\u0441\u0430",
          "zh-cn": "MAC\u5730\u5740"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.system.mac`, common, "state", val.payload.device_id, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Firmware major version",
          de: "Firmware-Hauptversion",
          ru: "\u043E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
          pt: "vers\xE3o principal do firmware",
          nl: "Firmware hoofdversie",
          fr: "Version majeure du firmware",
          it: "Versione principale del firmware",
          es: "Versi\xF3n principal del firmware",
          pl: "G\u0142\xF3wna wersja oprogramowania sprz\u0119towego",
          uk: "\u041E\u0441\u043D\u043E\u0432\u043D\u0430 \u0432\u0435\u0440\u0441\u0456\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
          "zh-cn": "\u56FA\u4EF6\u4E3B\u7248\u672C"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.major_ver`,
        common,
        "state",
        val.payload.major_ver,
        null,
        null
      );
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Firmware minor version",
          de: "Firmware-Nebenversion",
          ru: "\u043C\u0438\u043D\u043E\u0440\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
          pt: "vers\xE3o secund\xE1ria do firmware",
          nl: "Firmware minor-versie",
          fr: "Version mineure du firmware",
          it: "Versione secondaria del firmware",
          es: "Versi\xF3n secundaria del firmware",
          pl: "Wersja pomocnicza oprogramowania sprz\u0119towego",
          uk: "\u041C\u0456\u043D\u043E\u0440\u043D\u0430 \u0432\u0435\u0440\u0441\u0456\u044F \u043F\u0440\u043E\u0448\u0438\u0432\u043A\u0438",
          "zh-cn": "\u56FA\u4EF6\u6B21\u7248\u672C"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(
        `${this.dev.dp}.system.minor_ver`,
        common,
        "state",
        val.payload.minor_ver,
        null,
        null
      );
    }
  }
  /**
   * Create features e.g. 3D Object
   *
   * @param val Features
   */
  async createFeatures(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      if (val.payload.features && val.payload.features["3d"] || val.payload.configs && val.payload.configs["tv.model.3dSupportType"] == "3D") {
        const common = {
          type: "boolean",
          role: "switch",
          name: {
            en: "3D Mode on/off",
            de: "3D-Modus ein/aus",
            ru: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435/\u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 3D-\u0440\u0435\u0436\u0438\u043C\u0430",
            pt: "Modo 3D ativado/desativado",
            nl: "3D-modus aan/uit",
            fr: "Mode 3D activ\xE9/d\xE9sactiv\xE9",
            it: "Modalit\xE0 3D attivata/disattivata",
            es: "Modo 3D activado/desactivado",
            pl: "W\u0142\u0105czanie/wy\u0142\u0105czanie trybu 3D",
            uk: "3D-\u0440\u0435\u0436\u0438\u043C \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E/\u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E",
            "zh-cn": "3D\u6A21\u5F0F\u5F00/\u5173"
          },
          desc: "Create by Adapter",
          read: true,
          write: true,
          def: false
        };
        await this.createDataPoint(`${this.dev.dp}.remote.states.3dmode`, common, "state", false, null, null);
      }
      if (val.payload.receiverType != null && val.payload.receiverType != "" || val.payload.configs && val.payload.configs["tv.model.sysType"] != "") {
        let receiverType = "";
        if (val.payload.receiverType != null && val.payload.receiverType != "") {
          receiverType = val.payload.receiverType;
        }
        if (val.payload.configs && val.payload.configs["tv.model.sysType"] != "") {
          receiverType = val.payload.configs["tv.model.sysType"];
        }
        const common = {
          type: "string",
          role: "state",
          name: {
            en: "Receiver Type",
            de: "Empf\xE4ngertyp",
            ru: "\u0422\u0438\u043F \u043F\u0440\u0438\u0435\u043C\u043D\u0438\u043A\u0430",
            pt: "Tipo de receptor",
            nl: "Ontvangertype",
            fr: "Type de r\xE9cepteur",
            it: "Tipo di ricevitore",
            es: "Tipo de receptor",
            pl: "Typ odbiornika",
            uk: "\u0422\u0438\u043F \u043F\u0440\u0438\u0439\u043C\u0430\u0447\u0430",
            "zh-cn": "\u63A5\u6536\u5668\u7C7B\u578B"
          },
          desc: "Create by Adapter",
          read: true,
          write: false,
          def: ""
        };
        await this.createDataPoint(
          `${this.dev.dp}.system.receiverType`,
          common,
          "state",
          receiverType,
          null,
          null
        );
      }
      if (val.payload.modelName != null && val.payload.modelName != "" || val.payload.configs && val.payload.configs["tv.model.modelname"] != "") {
        let modelName = "";
        if (val.payload.modelName != null && val.payload.modelName != "") {
          modelName = val.payload.modelName;
        }
        if (val.payload.configs && val.payload.configs["tv.model.modelname"] != "") {
          modelName = val.payload.configs["tv.model.modelname"];
        }
        const common = {
          type: "string",
          role: "state",
          name: {
            en: "Receiver Type",
            de: "Empf\xE4ngertyp",
            ru: "\u0422\u0438\u043F \u043F\u0440\u0438\u0435\u043C\u043D\u0438\u043A\u0430",
            pt: "Tipo de receptor",
            nl: "Ontvangertype",
            fr: "Type de r\xE9cepteur",
            it: "Tipo di ricevitore",
            es: "Tipo de receptor",
            pl: "Typ odbiornika",
            uk: "\u0422\u0438\u043F \u043F\u0440\u0438\u0439\u043C\u0430\u0447\u0430",
            "zh-cn": "\u63A5\u6536\u5668\u7C7B\u578B"
          },
          desc: "Create by Adapter",
          read: true,
          write: false,
          def: ""
        };
        await this.createDataPoint(`${this.dev.dp}.system.modelName`, common, "state", modelName, null, null);
      }
      if (val.payload.configs && val.payload.configs["tv.model.serialnumber"] != "") {
        const common = {
          type: "string",
          role: "state",
          name: {
            en: "Serial number",
            de: "Seriennummer",
            ru: "\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440",
            pt: "N\xFAmero de s\xE9rie",
            nl: "Serienummer",
            fr: "Num\xE9ro de s\xE9rie",
            it: "Numero di serie",
            es: "N\xFAmero de serie",
            pl: "Numer seryjny",
            uk: "\u0421\u0435\u0440\u0456\u0439\u043D\u0438\u0439 \u043D\u043E\u043C\u0435\u0440",
            "zh-cn": "\u5E8F\u5217\u53F7"
          },
          desc: "Create by Adapter",
          read: true,
          write: false,
          def: ""
        };
        await this.createDataPoint(
          `${this.dev.dp}.system.serialNumber`,
          common,
          "state",
          val.payload.configs["tv.model.serialnumber"],
          null,
          null
        );
      }
    }
  }
  /**
   * Create input State
   *
   * @param val Input
   */
  async createInput(val) {
    if (this.dev.dp != void 0 && val.payload != void 0 && val.payload.devices != void 0 && val.payload.devices[0] != void 0 && val.payload.devices[0].id != void 0) {
      let states = {};
      states = { unknown: "Unknown" };
      let appId = "";
      for (const input of val.payload.devices) {
        if (input.hdmiPlugIn) {
          appId = input.appId;
        }
        states[input.appId] = input.label;
      }
      const common = {
        type: "string",
        role: "state",
        name: {
          en: "Input",
          de: "Eingang",
          ru: "\u0412\u0445\u043E\u0434",
          pt: "Entrada",
          nl: "Invoer",
          fr: "Saisir",
          it: "Ingresso",
          es: "Aporte",
          pl: "Wej\u015Bcie",
          uk: "\u0412\u0445\u0456\u0434",
          "zh-cn": "\u8F93\u5165"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: "unknown",
        states
      };
      if (appId != "") {
        await this.adapter.setState(`${this.dev.dp}.remote.states.launch`, { val: appId, ack: true });
      }
      if (appId == "") {
        appId = "unknown";
      }
      await this.createDataPoint(`${this.dev.dp}.remote.states.input`, common, "state", appId, null, null);
    }
  }
  /**
   * Create Channel list
   *
   * @param val channels
   */
  async createChannelList(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let channel = {};
      let channelId = {};
      channel = { unknown: "Unknown" };
      channelId = { unknown: "Unknown" };
      for (const input of val.payload.channelList) {
        channel[Number(input.channelNumber)] = input.channelName;
        channelId[input.channelId] = input.channelName;
      }
      await this.adapter.extendObject(`${this.dev.dp}.remote.states.channelId`, {
        common: { states: channelId }
      });
      await this.adapter.extendObject(`${this.dev.dp}.remote.states.channel`, { common: { states: channel } });
    }
  }
  /**
   * Create Volume State
   *
   * @param val Volume
   */
  async createOutput(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let common;
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Input",
          de: "Eingang",
          ru: "\u0412\u0445\u043E\u0434",
          pt: "Entrada",
          nl: "Invoer",
          fr: "Saisir",
          it: "Ingresso",
          es: "Aporte",
          pl: "Wej\u015Bcie",
          uk: "\u0412\u0445\u0456\u0434",
          "zh-cn": "\u8F93\u5165"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: "unknown",
        states: {
          unknown: "Unknown",
          tv_speaker: "TV Speaker",
          external_optical: "External Optical",
          external_arc: "External ARC",
          lineout: "LineOut",
          headphone: "Headphone",
          tv_external_speaker: "TV + External Speaker",
          tv_speaker_headphone: "TV + Speaker Headphone",
          bt_soundbar: "Bluetooth",
          soundbar: "Soundbar",
          external_speaker: "External Speaker"
        }
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.states.soundOutput`,
        common,
        "state",
        val.payload.volumeStatus.soundOutput,
        null,
        null
      );
      common = {
        type: "number",
        role: "value",
        name: {
          en: "TV Volume",
          de: "TV Volumen",
          ru: "\u041E\u0431\u044A\u0435\u043C \u0422\u0412",
          pt: "Volume de TV",
          nl: "TV Volum",
          fr: "Volume TV",
          it: "Volume TV",
          es: "Volumen de TV",
          pl: "Volume TV",
          uk: "\u0422\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440",
          "zh-cn": "\u7535\u89C6\u7535\u5F71"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        min: 0,
        max: val.payload.volumeStatus.maxVolume,
        step: 1,
        def: 0
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.states.volume`,
        common,
        "state",
        val.payload.volumeStatus.volume,
        null,
        null
      );
      if (val.payload.volumeStatus.muteStatus) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
          val: val.payload.volumeStatus.muteStatus,
          ack: true
        });
      }
    }
  }
  /**
   * Create Volume State old TV´s
   *
   * @param val Volume
   */
  async createOutputOld(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let common;
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Input",
          de: "Eingang",
          ru: "\u0412\u0445\u043E\u0434",
          pt: "Entrada",
          nl: "Invoer",
          fr: "Saisir",
          it: "Ingresso",
          es: "Aporte",
          pl: "Wej\u015Bcie",
          uk: "\u0412\u0445\u0456\u0434",
          "zh-cn": "\u8F93\u5165"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: "unknown",
        states: {
          unknown: "Unknown",
          tv_speaker: "TV Speaker",
          mastervolume_tv_speaker: "TV Speaker",
          external_optical: "External Optical",
          external_arc: "External ARC",
          lineout: "LineOut",
          headphone: "Headphone",
          tv_external_speaker: "TV + External Speaker",
          tv_speaker_headphone: "TV + Speaker Headphone",
          bt_soundbar: "Bluetooth",
          soundbar: "Soundbar",
          external_speaker: "External Speaker"
        }
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.states.soundOutput`,
        common,
        "state",
        val.payload.scenario,
        null,
        null
      );
      common = {
        type: "number",
        role: "value",
        name: {
          en: "TV Volume",
          de: "TV Volumen",
          ru: "\u041E\u0431\u044A\u0435\u043C \u0422\u0412",
          pt: "Volume de TV",
          nl: "TV Volum",
          fr: "Volume TV",
          it: "Volume TV",
          es: "Volumen de TV",
          pl: "Volume TV",
          uk: "\u0422\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440",
          "zh-cn": "\u7535\u89C6\u7535\u5F71"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        min: 0,
        max: 100,
        step: 1,
        def: 0
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.states.volume`,
        common,
        "state",
        val.payload.volume,
        null,
        null
      );
      if (val.payload.muted != null || val.payload.mute != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
          val: val.payload.muted ? val.payload.muted : val.payload.mute,
          ack: true
        });
      }
    }
  }
  /**
   * Create Device, Channels and States
   */
  async createDevice() {
    if (this.dev.dp != void 0) {
      let common;
      common = {
        name: this.dev.tvname != null ? this.dev.tvname : "",
        desc: this.dev.tvname != null ? this.dev.tvname : "",
        statusStates: {
          onlineId: `${this.adapter.namespace}.${this.dev.dp}.status.online`
        },
        icon: ""
      };
      await this.createDataPoint(this.dev.dp, common, "device", null, null, null);
      common = {
        name: {
          en: "Status",
          de: "Status",
          ru: "\u0421\u0442\u0430\u0442\u0443\u0441",
          pt: "Estado",
          nl: "Status",
          fr: "\xC9tat",
          it: "Stato",
          es: "Situaci\xF3n",
          pl: "Status",
          uk: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0438",
          "zh-cn": "\u73B0\u72B6"
        },
        desc: "Create by Adapter",
        icon: "img/status.png"
      };
      await this.createDataPoint(`${this.dev.dp}.status`, common, "channel", null, null, null);
      common = {
        name: {
          en: "Remote Control",
          de: "Fernsteuerung",
          ru: "\u0414\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u043E\u043D\u043D\u043E\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
          pt: "Controle remoto",
          nl: "Verwijder controle",
          fr: "T\xE9l\xE9commande",
          it: "Controllo remoto",
          es: "Control remoto",
          pl: "Kontrola Pami\u0119ci",
          uk: "\u041F\u0443\u043B\u044C\u0442 \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0456\u0439\u043D\u043E\u0433\u043E \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F",
          "zh-cn": "\u9065\u611F"
        },
        desc: "Create by Adapter",
        icon: "img/fernbedienung.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote`, common, "channel", null, null, null);
      common = {
        name: {
          en: "Remote control buttons",
          de: "Fernbedienungstasten",
          ru: "\u0423\u0434\u0430\u043B\u0435\u043D\u043D\u044B\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",
          pt: "Bot\xF5es de controle remoto",
          nl: "Verwijder controle knoppen",
          fr: "Boutons de commande \xE0 distance",
          it: "Pulsanti di controllo remoto",
          es: "Botones de control remoto",
          pl: "Klucze kontrolne",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0456\u0439\u043D\u043E\u0433\u043E \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F",
          "zh-cn": "\u9065\u63A7\u533A"
        },
        desc: "Create by Adapter",
        icon: "img/keys.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys`, common, "channel", null, null, null);
      common = {
        name: {
          en: "Mouse Cursor",
          de: "Mauszeiger",
          ru: "\u041A\u0443\u0440\u0441\u043E\u0440 \u043C\u044B\u0448\u0438",
          pt: "Cursor do mouse",
          nl: "Muiscursor",
          fr: "Curseur de la souris",
          it: "Cursore del mouse",
          es: "Cursor del rat\xF3n",
          pl: "Kursor myszy",
          uk: "\u041A\u0443\u0440\u0441\u043E\u0440 \u043C\u0438\u0448\u0456",
          "zh-cn": "\u9F20\u6807\u5149\u6807"
        },
        desc: "Create by Adapter",
        icon: "img/cursor.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.cursor`, common, "channel", null, null, null);
      common = {
        name: {
          en: "Notifications",
          de: "Benachrichtigungen",
          ru: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
          pt: "Notifica\xE7\xF5es",
          nl: "Verklaringen",
          fr: "Notifications",
          it: "Notifiche",
          es: "Notificaciones",
          pl: "Uwaga",
          uk: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",
          "zh-cn": "\u901A\u77E5"
        },
        desc: "Create by Adapter",
        icon: "img/notify.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.notify`, common, "channel", null, null, null);
      common = {
        name: {
          en: "own request",
          de: "eigene Anfrage",
          ru: "\u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441",
          pt: "pedido pr\xF3prio",
          nl: "een verzoek",
          fr: "propre demande",
          it: "propria richiesta",
          es: "propia solicitud",
          pl: "\u017C\u0105danie",
          uk: "\u0432\u043B\u0430\u0441\u043D\u0438\u0439 \u0437\u0430\u043F\u0438\u0442",
          "zh-cn": "\u81EA\u5DF1\u7684\u8BF7\u6C42"
        },
        desc: "Create by Adapter",
        icon: "img/own_request.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.own_request`, common, "channel", null, null, null);
      common = {
        name: {
          en: "Object states",
          de: "Objektzust\xE4nde",
          ru: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432",
          pt: "Estados de objeto",
          nl: "Objectstaten",
          fr: "\xC9tats de l'objet",
          it: "Stati degli oggetti",
          es: "Estados de objeto",
          pl: "Stany obiekt\xF3w",
          uk: "\u0421\u0442\u0430\u043D \u043E\u0431'\u0454\u043A\u0442\u0430",
          "zh-cn": "\u5BF9\u8C61\u72B6\u6001"
        },
        desc: "Create by Adapter",
        icon: "img/states.png"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states`, common, "channel", null, null, null);
      common = {
        name: {
          en: "System",
          de: "System",
          ru: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430",
          pt: "Sistema",
          nl: "Systeem",
          fr: "Syst\xE8me",
          it: "Sistema",
          es: "Sistema",
          pl: "System",
          uk: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430",
          "zh-cn": "\u7CFB\u7EDF"
        },
        desc: "Create by Adapter",
        icon: "img/settings.png"
      };
      await this.createDataPoint(`${this.dev.dp}.system`, common, "channel", null, null, null);
      common = {
        type: "boolean",
        role: "button",
        name: {
          en: "Mouse Cursor click",
          de: "Mausklick",
          ru: "\u0429\u0435\u043B\u0447\u043E\u043A \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C \u043C\u044B\u0448\u0438",
          pt: "Clique do cursor do mouse",
          nl: "Muiscursor klikken",
          fr: "Clic du curseur de la souris",
          it: "Clic del cursore del mouse",
          es: "Clic del cursor del rat\xF3n",
          pl: "Klikni\u0119cie kursorem myszy",
          uk: "\u041A\u043B\u0430\u0446\u0430\u043D\u043D\u044F \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C \u043C\u0438\u0448\u0456",
          "zh-cn": "\u9F20\u6807\u5149\u6807\u70B9\u51FB"
        },
        desc: "Create by Adapter",
        read: false,
        write: true,
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.cursor.click`, common, "state", false, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Pairing code",
          de: "Kopplungscode",
          ru: "\u041A\u043E\u0434 \u0441\u043E\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F",
          pt: "C\xF3digo de emparelhamento",
          nl: "Koppelingscode",
          fr: "Code d'appariement",
          it: "Codice di associazione",
          es: "C\xF3digo de emparejamiento",
          pl: "Kod parowania",
          uk: "\u041A\u043E\u0434 \u0441\u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043D\u044F",
          "zh-cn": "\u914D\u5BF9\u7801"
        },
        desc: "Create by Adapter",
        read: false,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.system.pair_code`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Mouse Cursor drag",
          de: "Ziehen mit dem Mauszeiger",
          ru: "\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u043A\u0443\u0440\u0441\u043E\u0440\u0430 \u043C\u044B\u0448\u0438",
          pt: "Arrastar o cursor do mouse",
          nl: "Slepen met de muiscursor",
          fr: "glisser le curseur de la souris",
          it: "Trascinamento del cursore del mouse",
          es: "Arrastre del cursor del rat\xF3n",
          pl: "Przeci\u0105ganie kursora myszy",
          uk: "\u041F\u0435\u0440\u0435\u0442\u044F\u0433\u0443\u0432\u0430\u043D\u043D\u044F \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C \u043C\u0438\u0448\u0456",
          "zh-cn": "\u9F20\u6807\u5149\u6807\u62D6\u52A8"
        },
        desc: "Create by Adapter",
        read: false,
        write: true,
        def: "1,1,drag"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.cursor.drag`, common, "state", "1,1,drag", null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Mouse Cursor scroll",
          de: "Mauszeiger scrollen",
          ru: "\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430 \u043A\u0443\u0440\u0441\u043E\u0440\u0430 \u043C\u044B\u0448\u0438",
          pt: "Rolagem do cursor do mouse",
          nl: "Muiscursor scrollen",
          fr: "D\xE9filement du curseur de la souris",
          it: "Scorrimento del cursore del mouse",
          es: "Desplazamiento del cursor del rat\xF3n",
          pl: "Przewijanie kursora myszy",
          uk: "\u041F\u0440\u043E\u043A\u0440\u0443\u0447\u0443\u0432\u0430\u043D\u043D\u044F \u043A\u0443\u0440\u0441\u043E\u0440\u043E\u043C \u043C\u0438\u0448\u0456",
          "zh-cn": "\u9F20\u6807\u5149\u6807\u6EDA\u52A8"
        },
        desc: "Create by Adapter",
        read: false,
        write: true,
        def: "1,1"
      };
      await this.createDataPoint(`${this.dev.dp}.remote.cursor.scroll`, common, "state", "1,1", null, null);
      common = {
        type: "boolean",
        role: "indicator.connected",
        name: {
          en: "Status TV",
          de: "Status TV",
          ru: "\u0421\u0442\u0430\u0442\u0443\u0441 \u0422\u0412",
          pt: "TV de status",
          nl: "Status TV",
          fr: "\xC9tat TV",
          it: "Stato TV",
          es: "Status TV",
          pl: "Status TV",
          uk: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0438",
          "zh-cn": "\u5730\u4F4D\u7535\u89C6"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.status.online`, common, "state", false, null, null);
      common = {
        type: "string",
        role: "json",
        name: {
          en: "The responses from the first adapterstart",
          de: "Die Antworten vom ersten Adapterstart",
          ru: "\u041E\u0442\u0432\u0435\u0442\u044B \u043E\u0442 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0430\u0434\u0430\u043F\u0442\u0435\u0440\u0430",
          pt: "As respostas do primeiro adaptador come\xE7am",
          nl: "De reacties van de eerste adapterstart",
          fr: "Les r\xE9ponses du premier adaptateur",
          it: "Le risposte del primo adattatore iniziano",
          es: "Las respuestas del primer adaptador comienzan",
          pl: "Odpowiedzi z pierwszego adaptera startowego",
          uk: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \u0432\u0456\u0434 \u043F\u0435\u0440\u0448\u043E\u0433\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0443 \u0430\u0434\u0430\u043F\u0442\u0435\u0440\u0430",
          "zh-cn": "\u6765\u81EA\u7B2C\u4E00\u4E2A\u9002\u914D\u5668\u7684\u54CD\u5E94"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: "[]"
      };
      await this.createDataPoint(`${this.dev.dp}.status.responseStart`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "json",
        name: {
          en: "Possible settings",
          de: "M\xF6gliche Einstellungen",
          ru: "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
          pt: "Configura\xE7\xF5es poss\xEDveis",
          nl: "Mogelijke instellingen",
          fr: "Param\xE8tres possibles",
          it: "Impostazioni possibili",
          es: "Posibles configuraciones",
          pl: "Mo\u017Cliwe ustawienia",
          uk: "\u041C\u043E\u0436\u043B\u0438\u0432\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
          "zh-cn": "\u53EF\u80FD\u7684\u8BBE\u7F6E"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: "[]"
      };
      await this.createDataPoint(`${this.dev.dp}.status.possibleSettings`, common, "state", null, null, null);
      common = {
        role: "button",
        name: {
          en: "Rewinding",
          de: "Zur\xFCckspulen",
          ru: "\u041F\u0435\u0440\u0435\u043C\u043E\u0442\u043A\u0430",
          pt: "Rebobinamento",
          nl: "Veranderen",
          fr: "Rewinding",
          it: "Riavvolgimento",
          es: "Rebobinado",
          pl: "Odwrotnie",
          uk: "\u041F\u0435\u0440\u0435\u043C\u043E\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
          "zh-cn": "\u9000\u7A0E"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.rewind`, common, "state", false, null, null);
      common = {
        role: "button.fastforward",
        name: {
          en: "Fast forwarding",
          de: "Schneller Vorlauf",
          ru: "\u0411\u044B\u0441\u0442\u0440\u043E\u0435 \u044D\u043A\u0441\u043F\u0435\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
          pt: "Encaminhamento r\xE1pido",
          nl: "Snel vooruit",
          fr: "Avance rapide ",
          it: "Avanti veloce",
          es: "\xA1Un avance r\xE1pido",
          pl: "Fast forwarding",
          uk: "\u0428\u0432\u0438\u0434\u043A\u0430 \u043F\u0435\u0440\u0435\u0430\u0434\u0440\u0435\u0441\u0430\u0446\u0456\u044F",
          "zh-cn": "\u524D\u8FDB"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.fastForward`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "exit",
          de: "Ausgang",
          ru: "\u0432\u044B\u0445\u043E\u0434",
          pt: "sa\xEDda",
          nl: "vertaling:",
          fr: "sortie",
          it: "uscita",
          es: "salida",
          pl: "wyj\u015Bcie",
          uk: "\u0443\u0432\u0456\u0439\u0442\u0438",
          "zh-cn": "\u64A4\u79BB"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.exit`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Home",
          de: "Home",
          ru: "\u041D\u0430\u0447\u0430\u043B\u043E",
          pt: "Home",
          nl: "Thuis",
          fr: "Home",
          it: "Home",
          es: "Home",
          pl: "Dom",
          uk: "\u0413\u043E\u043B\u043E\u0432\u043D\u0430",
          "zh-cn": "\u5BB6\u5EAD"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.home`, common, "state", false, null, null);
      common = {
        role: "button.volume.up",
        name: {
          en: "Volume Up",
          de: "Lautst\xE4rke nach oben",
          ru: "\u041E\u0431\u044A\u0435\u043C Up",
          pt: "Volume para cima",
          nl: "Volume Up",
          fr: "Volume",
          it: "Volume su",
          es: "Volumen Up",
          pl: "Volume Up",
          uk: "\u041E\u0431'\u0454\u043C",
          "zh-cn": "\u7B2C\u4E00\u5377"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.volumeUp`, common, "state", false, null, null);
      common = {
        role: "button.volume.down",
        name: {
          en: "Volume down",
          de: "Lautst\xE4rke nach unten",
          ru: "\u041E\u0431\u044A\u0435\u043C \u0432\u043D\u0438\u0437",
          pt: "Volume para baixo",
          nl: "Volume down",
          fr: "Volume vers le bas",
          it: "Volume down",
          es: "Volumen baja",
          pl: "Volumen down",
          uk: "\u041E\u0431'\u0454\u043C",
          "zh-cn": "\u91CF\u5211"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.volumeDown`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Red button",
          de: "Roter Knopf",
          ru: "\u041A\u0440\u0430\u0441\u043D\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430",
          pt: "Bot\xE3o vermelho",
          nl: "Rode knop",
          fr: "Bouton rouge",
          it: "Pulsante rosso",
          es: "Bot\xF3n rojo",
          pl: "Przycisk",
          uk: "\u0427\u0435\u0440\u0432\u043E\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0430",
          "zh-cn": "D. \u7EA2\u5341\u5B57\u4F1A\u548C\u7EA2\u65B0\u6708\u4F1A"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.red`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Green button",
          de: "Gr\xFCner Knopf",
          ru: "\u0417\u0435\u043B\u0435\u043D\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430",
          pt: "Bot\xE3o verde",
          nl: "Groene knop",
          fr: "Bouton vert",
          it: "Pulsante verde",
          es: "Bot\xF3n verde",
          pl: "Green's button",
          uk: "\u0417\u0435\u043B\u0435\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0430",
          "zh-cn": "\u7EFF\u8272\u987F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.green`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Yellow button",
          de: "Gelber Knopf",
          ru: "\u0416\u0435\u043B\u0442\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430",
          pt: "Bot\xE3o amarelo",
          nl: "Gele knop",
          fr: "Bouton jaune",
          it: "Pulsante giallo",
          es: "Bot\xF3n amarillo",
          pl: "Przycisk",
          uk: "\u0416\u043E\u0432\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0430",
          "zh-cn": "Yellow\u4F46ton"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.yellow`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Blue button",
          de: "Blauer Knopf",
          ru: "\u0413\u043E\u043B\u0443\u0431\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430",
          pt: "Bot\xE3o azul",
          nl: "Blauwe knop",
          fr: "Bouton bleu",
          it: "Pulsante blu",
          es: "Bot\xF3n azul",
          pl: "Blue button",
          uk: "\u0421\u0438\u043D\u044F \u043A\u043D\u043E\u043F\u043A\u0430",
          "zh-cn": "\u84DD\u56FE"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.blue`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 0",
          de: "Taste 0",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 0",
          pt: "Bot\xE3o 0",
          nl: "Button 0",
          fr: "Button 0",
          it: "Pulsante 0",
          es: "Bot\xF3n 0",
          pl: "Button 0",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 0",
          "zh-cn": "\u5E03\u987F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit0`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 1",
          de: "Taste 1",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 1",
          pt: "Bot\xE3o 1",
          nl: "Button 1",
          fr: "Button 1",
          it: "Pulsante 1",
          es: "Bot\xF3n 1",
          pl: "Button 1",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 1",
          "zh-cn": "\u5E03\u987F1"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit1`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 2",
          de: "Taste 2",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 2",
          pt: "Bot\xE3o 2",
          nl: "Button 2",
          fr: "Button 2",
          it: "Pulsante 2",
          es: "Bot\xF3n 2",
          pl: "Button 2",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 2",
          "zh-cn": "\u5E03\u987F2"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit2`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 3",
          de: "Taste 3",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 3",
          pt: "Bot\xE3o 3",
          nl: "Button 3",
          fr: "Button 3",
          it: "Pulsante 3",
          es: "Bot\xF3n 3",
          pl: "Button 3",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 3",
          "zh-cn": "\u5E03\u987F3"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit3`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 4",
          de: "Taste 4",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 4",
          pt: "Bot\xE3o 4",
          nl: "Button 4",
          fr: "Button 4",
          it: "Pulsante 4",
          es: "Bot\xF3n 4",
          pl: "Button 4",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 4",
          "zh-cn": "\u5E03\u987F4"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit4`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 5",
          de: "Taste 5",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 5",
          pt: "Bot\xE3o 5",
          nl: "Button 5",
          fr: "Button 5",
          it: "Pulsante 5",
          es: "Button 5",
          pl: "Button 5",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 5",
          "zh-cn": "\u5E03\u987F5"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit5`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 6",
          de: "Taste 6",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 6",
          pt: "Bot\xE3o 6",
          nl: "Button 6",
          fr: "Button 6",
          it: "Pulsante 6",
          es: "Bot\xF3n 6",
          pl: "Button 6",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 6",
          "zh-cn": "\u5E03\u987F6"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit6`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 7",
          de: "Taste 7",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 7",
          pt: "Bot\xE3o 7",
          nl: "Button 7",
          fr: "Button 7",
          it: "Pulsante 7",
          es: "Button 7",
          pl: "Button 7",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 7",
          "zh-cn": "\u4F46\u7B2C7\u6761"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit7`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 8",
          de: "Taste 8",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 8",
          pt: "Bot\xE3o 8",
          nl: "Button 8",
          fr: "Button 8",
          it: "Pulsante 8",
          es: "Button 8",
          pl: "Button 8",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 8",
          "zh-cn": "\u4F46\u7B2C8\u6761"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit8`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Button 9",
          de: "Knopf 9",
          ru: "\u041A\u043D\u043E\u043F\u043A\u0430 9",
          pt: "Bot\xE3o 9",
          nl: "Button 9",
          fr: "Button 9",
          it: "Pulsante 9",
          es: "Bot\xF3n 9",
          pl: "Button 9",
          uk: "\u041A\u043D\u043E\u043F\u043A\u0430 9",
          "zh-cn": "\u5E03\u987F9"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.digit9`, common, "state", false, null, null);
      common = {
        type: "boolean",
        role: "switch",
        name: {
          en: "mute",
          de: "stumm",
          ru: "\u043C\u0438\u043B\u044B\u0439",
          pt: "muda",
          nl: "mute",
          fr: "mute",
          it: "mute",
          es: "mute",
          pl: "bunt",
          uk: "\u043C\u0430\u043F\u0430",
          "zh-cn": "\u7A46\u7279"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.mute`, common, "state", false, null, null);
      common = {
        type: "boolean",
        role: "button",
        name: {
          en: "Sends a delete key press",
          de: "Sendet einen Tastendruck der Entf-Taste",
          ru: "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u043D\u0430\u0436\u0430\u0442\u0438\u0435 \u043A\u043B\u0430\u0432\u0438\u0448\u0438 Delete.",
          pt: "Envia um pressionamento da tecla Delete.",
          nl: "Verzendt een druk op de delete-toets.",
          fr: "Envoie une pression sur la touche Suppr.",
          it: "Invia una pressione del tasto Elimina",
          es: "Env\xEDa una pulsaci\xF3n de tecla eliminar",
          pl: "Wysy\u0142a naci\u015Bni\u0119cie klawisza Delete",
          uk: "\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u0454 \u043D\u0430\u0442\u0438\u0441\u043A\u0430\u043D\u043D\u044F \u043A\u043B\u0430\u0432\u0456\u0448\u0456 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u044F",
          "zh-cn": "\u53D1\u9001\u5220\u9664\u952E\u6309\u4E0B"
        },
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.deleteText`, common, "state", false, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Inserts text into the currently focused input field",
          de: "F\xFCgt Text in das aktuell fokussierte Eingabefeld ein.",
          ru: "\u0412\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0442\u0435\u043A\u0441\u0442 \u0432 \u0442\u0435\u043A\u0443\u0449\u0435\u0435 \u043F\u043E\u043B\u0435 \u0432\u0432\u043E\u0434\u0430, \u043D\u0430\u0445\u043E\u0434\u044F\u0449\u0435\u0435\u0441\u044F \u0432 \u0444\u043E\u043A\u0443\u0441\u0435.",
          pt: "Insere texto no campo de entrada atualmente selecionado.",
          nl: "Voegt tekst in het momenteel geselecteerde invoerveld in.",
          fr: "Ins\xE8re du texte dans le champ de saisie actuellement s\xE9lectionn\xE9.",
          it: "Inserisce il testo nel campo di input attualmente attivo",
          es: "Inserta texto en el campo de entrada enfocado actualmente",
          pl: "Wstawia tekst do aktualnie wybranego pola wprowadzania danych",
          uk: "\u0412\u0441\u0442\u0430\u0432\u043B\u044F\u0454 \u0442\u0435\u043A\u0441\u0442 \u0443 \u043F\u043E\u0442\u043E\u0447\u043D\u0435 \u043F\u043E\u043B\u0435 \u0432\u0432\u0435\u0434\u0435\u043D\u043D\u044F, \u043D\u0430 \u044F\u043A\u043E\u043C\u0443 \u0437\u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C\u0441\u044F \u0444\u043E\u043A\u0443\u0441",
          "zh-cn": "\u5C06\u6587\u672C\u63D2\u5165\u5230\u5F53\u524D\u805A\u7126\u7684\u8F93\u5165\u5B57\u6BB5\u4E2D"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.insertText`, common, "state", "", null, null);
      common = {
        type: "boolean",
        role: "switch",
        name: {
          en: "MDN Log enabled/disabled",
          de: "MDN-Protokoll aktiviert/deaktiviert",
          ru: "\u0416\u0443\u0440\u043D\u0430\u043B MDN \u0432\u043A\u043B\u044E\u0447\u0435\u043D/\u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D",
          pt: "Registro MDN ativado/desativado",
          nl: "MDN-logboek in-/uitgeschakeld",
          fr: "Journal MDN activ\xE9/d\xE9sactiv\xE9",
          it: "Registro MDN abilitato/disabilitato",
          es: "Registro MDN habilitado/deshabilitado",
          pl: "W\u0142\u0105czono/wy\u0142\u0105czono dziennik MDN",
          uk: "\u0416\u0443\u0440\u043D\u0430\u043B MDN \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E/\u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E",
          "zh-cn": "MDN\u65E5\u5FD7\u5DF2\u542F\u7528/\u5DF2\u7981\u7528"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.mdnLog`, common, "state", false, null, null);
      common = {
        type: "number",
        role: "value",
        name: {
          en: "TV Channel",
          de: "Fernsehkanal",
          ru: "\u0422\u0435\u043B\u0435\u043A\u0430\u043D\u0430\u043B",
          pt: "Canal de TV",
          nl: "Tv-kanaal",
          fr: "Cha\xEEne de t\xE9l\xE9vision",
          it: "Canale televisivo",
          es: "Canal de televisi\xF3n",
          pl: "Kana\u0142 telewizyjny",
          uk: "\u0422\u0435\u043B\u0435\u043A\u0430\u043D\u0430\u043B",
          "zh-cn": "\u7535\u89C6\u53F0"
        },
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: 0
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.channel`, common, "state", 0, null, null);
      common = {
        role: "button",
        name: {
          en: "Closes the app launcher",
          de: "Schlie\xDFt den App-Launcher",
          ru: "\u0417\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u043F\u0430\u043D\u0435\u043B\u044C \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
          pt: "Fecha o iniciador de aplicativos.",
          nl: "Sluit de app-launcher.",
          fr: "Ferme le lanceur d'applications",
          it: "Chiude l'app launcher",
          es: "Cierra el iniciador de aplicaciones.",
          pl: "Zamyka program uruchamiaj\u0105cy aplikacje",
          uk: "\u0417\u0430\u043A\u0440\u0438\u0432\u0430\u0454 \u043F\u0430\u043D\u0435\u043B\u044C \u0437\u0430\u043F\u0443\u0441\u043A\u0443 \u043F\u0440\u043E\u0433\u0440\u0430\u043C",
          "zh-cn": "\u5173\u95ED\u5E94\u7528\u542F\u52A8\u5668"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.closeLaunch`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Takes a screenshot of the current TV display",
          de: "Erstellt einen Screenshot des aktuellen Fernsehbildschirms.",
          ru: "\u0414\u0435\u043B\u0430\u0435\u0442 \u0441\u043D\u0438\u043C\u043E\u043A \u044D\u043A\u0440\u0430\u043D\u0430 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0442\u0435\u043B\u0435\u0432\u0438\u0437\u043E\u0440\u0430.",
          pt: "Captura uma imagem da tela atual da TV.",
          nl: "Maakt een schermafbeelding van het huidige tv-scherm.",
          fr: "Prend une capture d'\xE9cran de l'\xE9cran de t\xE9l\xE9vision actuel.",
          it: "Esegue uno screenshot dello schermo TV corrente",
          es: "Toma una captura de pantalla de la pantalla del televisor actual.",
          pl: "Wykonuje zrzut ekranu bie\u017C\u0105cego ekranu telewizora",
          uk: "\u0420\u043E\u0431\u0438\u0442\u044C \u0437\u043D\u0456\u043C\u043E\u043A \u0435\u043A\u0440\u0430\u043D\u0430 \u043F\u043E\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0435\u043A\u0440\u0430\u043D\u0430 \u0442\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440\u0430",
          "zh-cn": "\u622A\u53D6\u5F53\u524D\u7535\u89C6\u5C4F\u5E55\u7684\u5C4F\u5E55\u622A\u56FE"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.screenshot`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Closes a web application running",
          de: "Schlie\xDFt eine laufende Webanwendung",
          ru: "\u0417\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0435\u0435 \u0432\u0435\u0431-\u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
          pt: "Fecha um aplicativo web em execu\xE7\xE3o.",
          nl: "Sluit een webapplicatie die actief is.",
          fr: "Ferme une application web en cours d'ex\xE9cution",
          it: "Chiude un'applicazione web in esecuzione",
          es: "Cierra una aplicaci\xF3n web en ejecuci\xF3n",
          pl: "Zamyka dzia\u0142aj\u0105c\u0105 aplikacj\u0119 internetow\u0105",
          uk: "\u0417\u0430\u043A\u0440\u0438\u0432\u0430\u0454 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u0443 \u0432\u0435\u0431-\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0443",
          "zh-cn": "\u5173\u95ED\u6B63\u5728\u8FD0\u884C\u7684 Web \u5E94\u7528\u7A0B\u5E8F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.closeWebApp`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Activates the screensaver",
          de: "Aktiviert den Bildschirmschoner",
          ru: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u0435\u0442 \u0437\u0430\u0441\u0442\u0430\u0432\u043A\u0443",
          pt: "Ativa o protetor de tela",
          nl: "Activeert de schermbeveiliging",
          fr: "Active l'\xE9conomiseur d'\xE9cran",
          it: "Attiva lo screensaver",
          es: "Activa el protector de pantalla",
          pl: "Aktywuje wygaszacz ekranu",
          uk: "\u0410\u043A\u0442\u0438\u0432\u0443\u0454 \u0437\u0430\u0441\u0442\u0430\u0432\u043A\u0443",
          "zh-cn": "\u542F\u7528\u5C4F\u5E55\u4FDD\u62A4\u7A0B\u5E8F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.screenSaver`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Activates the screensaver",
          de: "Aktiviert den Bildschirmschoner",
          ru: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u0435\u0442 \u0437\u0430\u0441\u0442\u0430\u0432\u043A\u0443",
          pt: "Ativa o protetor de tela",
          nl: "Activeert de schermbeveiliging",
          fr: "Active l'\xE9conomiseur d'\xE9cran",
          it: "Attiva lo screensaver",
          es: "Activa el protector de pantalla",
          pl: "Aktywuje wygaszacz ekranu",
          uk: "\u0410\u043A\u0442\u0438\u0432\u0443\u0454 \u0437\u0430\u0441\u0442\u0430\u0432\u043A\u0443",
          "zh-cn": "\u542F\u7528\u5C4F\u5E55\u4FDD\u62A4\u7A0B\u5E8F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.keys.showInputPicker`,
        common,
        "state",
        false,
        null,
        null
      );
      common = {
        role: "button.start",
        name: {
          en: "Play",
          de: "Abspielen",
          ru: "\u0418\u0433\u0440\u0430\u0442\u044C",
          pt: "Jogar",
          nl: "Toneelstuk",
          fr: "Jouer",
          it: "Giocare",
          es: "Jugar",
          pl: "Gra\u0107",
          uk: "\u0413\u0440\u0430\u0442\u0438",
          "zh-cn": "\u73A9"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.play`, common, "state", false, null, null);
      common = {
        role: "button.pause",
        name: {
          en: "Pause",
          de: "Pause",
          ru: "\u041F\u0430\u0443\u0437\u0430",
          pt: "Pausa",
          nl: "Pauze",
          fr: "Pause",
          it: "Pausa",
          es: "Pausa",
          pl: "Pauza",
          uk: "\u041F\u0430\u0443\u0437\u0430",
          "zh-cn": "\u6682\u505C"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.pause`, common, "state", false, null, null);
      common = {
        role: "button.stop",
        name: {
          en: "Stop",
          de: "Stopp",
          ru: "\u0421\u0442\u043E\u043F",
          pt: "P\xE1ra",
          nl: "Stop",
          fr: "Arr\xEAte",
          it: "Fermati",
          es: "Para",
          pl: "Stop",
          uk: "\u0417\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u0443\u0432\u0430\u0442\u0438\u0441\u044F",
          "zh-cn": "\u7981\u6B62"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.stop`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Channel Step Down",
          de: "Kanal nach unten",
          ru: "\u041A\u0430\u043D\u0430\u043B \u0428\u0430\u0433 \u0412\u043D\u0438\u0437",
          pt: "Passo do canal para baixo",
          nl: "Channel Step Down",
          fr: "Channel Step Down",
          it: "Canale passo gi\xF9",
          es: "Canales abajo",
          pl: "Channel Step Down",
          uk: "\u041A\u0430\u043D\u0430\u043B \u041A\u0440\u043E\u043A \u0432\u043D\u0438\u0437",
          "zh-cn": "Channel Step Down"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.channelDown`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Channel Step Up",
          de: "Kanal nach oben",
          ru: "\u041A\u0430\u043D\u0430\u043B Step Up",
          pt: "Passo do canal para cima",
          nl: "Kanaal Step Up",
          fr: "Channel Step Up",
          it: "Canale passo su",
          es: "Canales arriba",
          pl: "Channel Step Up",
          uk: "\u041A\u0430\u043D\u0430\u043B \u041A\u0440\u043E\u043A \u0432\u0433\u043E\u0440\u0443",
          "zh-cn": "\u6D77\u5CE1\u6B65\u9AA4"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.channelUp`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "return",
          de: "zur\xFCck",
          ru: "\u0432\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F",
          pt: "retorno",
          nl: "terug",
          fr: "retour",
          it: "ritorno",
          es: "retorno",
          pl: "wraca\u0107",
          uk: "\u0443\u0432\u0456\u0439\u0442\u0438",
          "zh-cn": "\u8FD4\u56DE"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.back`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "TV Off",
          de: "Fernseher aus",
          ru: "\u0422\u0435\u043B\u0435\u0432\u0438\u0437\u043E\u0440 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D",
          pt: "TV desligada",
          nl: "Tv uit",
          fr: "T\xE9l\xE9vision \xE9teinte",
          it: "TV spenta",
          es: "TV apagada",
          pl: "Wy\u0142\u0105czony telewizor",
          uk: "\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043E \u0442\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440",
          "zh-cn": "\u7535\u89C6\u5173\u673A"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.powerOff`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "TV On",
          de: "Fernsehen an",
          ru: "\u0422\u0412 \u0432\u043A\u043B\u044E\u0447\u0435\u043D",
          pt: "TV Ligada",
          nl: "TV aan",
          fr: "T\xE9l\xE9vision allum\xE9e",
          it: "TV accesa",
          es: "Televisi\xF3n encendida",
          pl: "Telewizor w\u0142\u0105czony",
          uk: "\u0422\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
          "zh-cn": "\u7535\u89C6"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.powerOn`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Screen On",
          de: "Bildschirm an",
          ru: "\u042D\u043A\u0440\u0430\u043D \u0432\u043A\u043B\u044E\u0447\u0435\u043D",
          pt: "Tela ligada",
          nl: "Scherm aan",
          fr: "\xC9cran allum\xE9",
          it: "Schermo acceso",
          es: "Pantalla encendida",
          pl: "Ekran w\u0142\u0105czony",
          uk: "\u0415\u043A\u0440\u0430\u043D \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
          "zh-cn": "\u5C4F\u5E55\u5F00\u542F"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.screenOn`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Screen Off",
          de: "Bildschirm aus",
          ru: "\u042D\u043A\u0440\u0430\u043D \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D",
          pt: "Tela desligada",
          nl: "Scherm uit",
          fr: "\xC9cran \xE9teint",
          it: "Schermo spento",
          es: "Pantalla apagada",
          pl: "Zastawia\u0107 parawanem",
          uk: "\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u0435\u043A\u0440\u0430\u043D\u0430",
          "zh-cn": "\u5C4F\u5E55\u5173\u95ED"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.screenOff`, common, "state", false, null, null);
      common = {
        role: "state",
        name: {
          en: "Create notification",
          de: "Benachrichtigung erstellen",
          ru: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",
          pt: "Criar notifica\xE7\xE3o",
          nl: "Maak een melding aan",
          fr: "Cr\xE9er une notification",
          it: "Crea notifica",
          es: "Crear notificaci\xF3n",
          pl: "Utw\xF3rz powiadomienie",
          uk: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
          "zh-cn": "\u521B\u5EFA\u901A\u77E5"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.notify.createToast`, common, "state", "", null, null);
      common = {
        role: "state",
        name: {
          en: "Close notification",
          de: "Benachrichtigung schlie\xDFen",
          ru: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",
          pt: "Fechar notifica\xE7\xE3o",
          nl: "Melding sluiten",
          fr: "Fermer la notification",
          it: "Chiudi notifica",
          es: "Cerrar notificaci\xF3n",
          pl: "Zamknij powiadomienie",
          uk: "\u0417\u0430\u043A\u0440\u0438\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
          "zh-cn": "\u5173\u95ED\u901A\u77E5"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: "",
        states: { no: "no toast id" }
      };
      await this.createDataPoint(`${this.dev.dp}.remote.notify.closeToast`, common, "state", "no", null, null);
      common = {
        role: "state",
        name: {
          en: "Create alert message",
          de: "Warnmeldung erstellen",
          ru: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435-\u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u0435",
          pt: "Criar mensagem de alerta",
          nl: "Maak een waarschuwingsbericht aan",
          fr: "Cr\xE9er un message d'alerte",
          it: "Crea messaggio di avviso",
          es: "Crear mensaje de alerta",
          pl: "Utw\xF3rz wiadomo\u015B\u0107 alertu",
          uk: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
          "zh-cn": "\u521B\u5EFA\u63D0\u9192\u6D88\u606F"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.notify.createAlert`, common, "state", "", null, null);
      common = {
        role: "state",
        name: {
          en: "Alert message close",
          de: "Warnmeldung schlie\xDFen",
          ru: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u043E",
          pt: "Fechar mensagem de alerta",
          nl: "Waarschuwingsbericht sluiten",
          fr: "Fermer le message d'alerte",
          it: "Messaggio di avviso chiuso",
          es: "Mensaje de alerta cerrado",
          pl: "Komunikat ostrzegawczy zamkni\u0119ty",
          uk: "\u0417\u0430\u043A\u0440\u0438\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
          "zh-cn": "\u5173\u95ED\u8B66\u62A5\u6D88\u606F"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: "",
        states: { no: "no alert id" }
      };
      await this.createDataPoint(`${this.dev.dp}.remote.notify.closeAlert`, common, "state", "no", null, null);
      common = {
        role: "json",
        name: {
          en: "Own request",
          de: "Eigene Anfrage",
          ru: "\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441",
          pt: "A pedido pr\xF3prio",
          nl: "Eigen verzoek",
          fr: "Demande personnelle",
          it: "Richiesta personale",
          es: "Solicitud propia",
          pl: "W\u0142asne \u017C\u0105danie",
          uk: "\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0437\u0430\u043F\u0438\u0442",
          "zh-cn": "\u672C\u4EBA\u8BF7\u6C42"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: JSON.stringify({
          type: "request",
          uri: "com.webos.service.ime/sendEnterKey",
          payload: { name: "1" },
          prefix: "ssap://"
        })
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.own_request.request`,
        common,
        "state",
        JSON.stringify({
          type: "request",
          uri: "com.webos.service.ime/sendEnterKey",
          payload: { name: "1" },
          prefix: "ssap://"
        }),
        null,
        null
      );
      common = {
        role: "json",
        name: {
          en: "Response",
          de: "Antwort",
          ru: "\u041E\u0442\u0432\u0435\u0442",
          pt: "Resposta",
          nl: "Antwoord",
          fr: "R\xE9ponse",
          it: "Risposta",
          es: "Respuesta",
          pl: "Odpowied\u017A",
          uk: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C",
          "zh-cn": "\u56DE\u590D"
        },
        type: "string",
        read: true,
        write: true,
        desc: "Create by Adapter",
        def: JSON.stringify({})
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.own_request.response`,
        common,
        "state",
        JSON.stringify({}),
        null,
        null
      );
      common = {
        role: "json",
        name: {
          en: "Response from subscribed",
          de: "Antwort von Abonnenten",
          ru: "\u041E\u0442\u0432\u0435\u0442 \u043E\u0442 \u043F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u043E\u0432",
          pt: "Resposta do assinante",
          nl: "Reactie van abonnees",
          fr: "R\xE9ponse des abonn\xE9s",
          it: "Risposta da iscritto",
          es: "Respuesta del suscrito",
          pl: "Odpowied\u017A od subskrybenta",
          uk: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C \u0432\u0456\u0434 \u043F\u0456\u0434\u043F\u0438\u0441\u0430\u043D\u043E\u0433\u043E \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430",
          "zh-cn": "\u8BA2\u9605\u8005\u7684\u56DE\u590D"
        },
        type: "string",
        read: true,
        write: false,
        desc: "Create by Adapter",
        def: JSON.stringify({})
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.own_request.responseSubscribe`,
        common,
        "state",
        JSON.stringify({}),
        null,
        null
      );
      common = {
        role: "button",
        name: {
          en: "LG Menu",
          de: "LG-Men\xFC",
          ru: "\u041C\u0435\u043D\u044E LG",
          pt: "Menu LG",
          nl: "LG-menu",
          fr: "Menu LG",
          it: "Men\xF9 LG",
          es: "Men\xFA LG",
          pl: "Menu LG",
          uk: "\u041C\u0435\u043D\u044E LG",
          "zh-cn": "LG\u83DC\u5355"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.menu`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Enter",
          de: "Eingeben",
          ru: "\u0412\u0445\u043E\u0434\u0438\u0442\u044C",
          pt: "Digitar",
          nl: "Binnenkomen",
          fr: "Entrer",
          it: "Entra",
          es: "Ingresar",
          pl: "Wchodzi\u0107",
          uk: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C",
          "zh-cn": "\u8FDB\u5165"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.enter`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Up",
          de: "Hoch",
          ru: "\u0412\u0432\u0435\u0440\u0445",
          pt: "Acima",
          nl: "Omhoog",
          fr: "En haut",
          it: "Su",
          es: "Arriba",
          pl: "W g\xF3r\u0119",
          uk: "\u0412\u0433\u043E\u0440\u0443",
          "zh-cn": "\u5411\u4E0A"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.up`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Left",
          de: "Links",
          ru: "\u041B\u0435\u0432\u044B\u0439",
          pt: "Esquerda",
          nl: "Links",
          fr: "Gauche",
          it: "Sinistra",
          es: "Izquierda",
          pl: "Lewy",
          uk: "\u041B\u0456\u0432\u043E\u0440\u0443\u0447",
          "zh-cn": "\u5DE6\u8FB9"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.left`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Right",
          de: "Rechts",
          ru: "\u0412\u0435\u0440\u043D\u043E",
          pt: "Certo",
          nl: "Rechts",
          fr: "Droite",
          it: "Giusto",
          es: "Bien",
          pl: "Prawid\u0142owy",
          uk: "\u041F\u0440\u0430\u0432\u043E\u0440\u0443\u0447",
          "zh-cn": "\u6B63\u786E\u7684"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.right`, common, "state", false, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Open URL in TV Browser",
          de: "URL im TV-Browser \xF6ffnen",
          ru: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0422\u0412",
          pt: "Abrir URL no navegador da TV",
          nl: "Open URL in tv-browser",
          fr: "Ouvrir l'URL dans le navigateur TV",
          it: "Apri URL nel browser TV",
          es: "Abrir URL en el navegador del televisor",
          pl: "Otw\xF3rz adres URL w przegl\u0105darce telewizyjnej",
          uk: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 URL-\u0430\u0434\u0440\u0435\u0441\u0443 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456 \u0442\u0435\u043B\u0435\u0432\u0456\u0437\u043E\u0440\u0430",
          "zh-cn": "\u5728\u7535\u89C6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00\u7F51\u5740"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.openURL`, common, "state", "", null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Channel Id",
          de: "Kanal-ID",
          ru: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043A\u0430\u043D\u0430\u043B\u0430",
          pt: "ID do canal",
          nl: "Kanaal-ID",
          fr: "ID du canal",
          it: "ID canale",
          es: "Identificaci\xF3n del canal",
          pl: "Identyfikator kana\u0142u",
          uk: "\u0406\u0434\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0442\u043E\u0440 \u043A\u0430\u043D\u0430\u043B\u0443",
          "zh-cn": "\u901A\u9053 ID"
        },
        desc: "Create by Adapter",
        read: true,
        write: true,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.channelId`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Channel Type",
          de: "Kanaltyp",
          ru: "\u0422\u0438\u043F \u043A\u0430\u043D\u0430\u043B\u0430",
          pt: "Tipo de canal",
          nl: "Kanaaltype",
          fr: "Type de canal",
          it: "Tipo di canale",
          es: "Tipo de canal",
          pl: "Typ kana\u0142u",
          uk: "\u0422\u0438\u043F \u043A\u0430\u043D\u0430\u043B\u0443",
          "zh-cn": "\u901A\u9053\u7C7B\u578B"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.channelType`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Channel Name",
          de: "Kanalname",
          ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u043D\u0430\u043B\u0430",
          pt: "Nome do canal",
          nl: "Kanaalnaam",
          fr: "Nom de la cha\xEEne",
          it: "Nome del canale",
          es: "Nombre del canal",
          pl: "Nazwa kana\u0142u",
          uk: "\u041D\u0430\u0437\u0432\u0430 \u043A\u0430\u043D\u0430\u043B\u0443",
          "zh-cn": "\u9891\u9053\u540D\u79F0"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.channelName`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Channel Model",
          de: "Kanalmodell",
          ru: "\u041C\u043E\u0434\u0435\u043B\u044C \u043A\u0430\u043D\u0430\u043B\u0430",
          pt: "Modelo de canal",
          nl: "Kanaalmodel",
          fr: "Mod\xE8le de canal",
          it: "Modello di canale",
          es: "Modelo de canal",
          pl: "Model kana\u0142u",
          uk: "\u041C\u043E\u0434\u0435\u043B\u044C \u043A\u0430\u043D\u0430\u043B\u0443",
          "zh-cn": "\u6E20\u9053\u6A21\u578B"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.channelModel`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Program ID",
          de: "Programm-ID",
          ru: "\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
          pt: "ID do programa",
          nl: "Programma-ID",
          fr: "ID du programme",
          it: "ID programma",
          es: "Identificaci\xF3n del programa",
          pl: "Identyfikator programu",
          uk: "\u0406\u0434\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u7A0B\u5E8F ID"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.programId`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Program Name",
          de: "Programmname",
          ru: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
          pt: "Nome do programa",
          nl: "Programmanaam",
          fr: "Nom du programme",
          it: "Nome del programma",
          es: "Nombre del programa",
          pl: "Nazwa programu",
          uk: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u7A0B\u5E8F\u540D\u79F0"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.programName`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "state",
        name: {
          en: "Program Description",
          de: "Programmbeschreibung",
          ru: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
          pt: "Descri\xE7\xE3o do programa",
          nl: "Programmaomschrijving",
          fr: "Description du programme",
          it: "Descrizione del programma",
          es: "Descripci\xF3n del programa",
          pl: "Opis programu",
          uk: "\u041E\u043F\u0438\u0441 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u9879\u76EE\u63CF\u8FF0"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.programDesc`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "date.start",
        name: {
          en: "Program Start",
          de: "Programmstart",
          ru: "\u041D\u0430\u0447\u0430\u043B\u043E \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
          pt: "In\xEDcio do programa",
          nl: "Programma start",
          fr: "D\xE9but du programme",
          it: "Avvio del programma",
          es: "Inicio del programa",
          pl: "Rozpocz\u0119cie programu",
          uk: "\u0417\u0430\u043F\u0443\u0441\u043A \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u8282\u76EE\u5F00\u59CB"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.programStart`, common, "state", null, null, null);
      common = {
        type: "string",
        role: "date.end",
        name: {
          en: "Program End",
          de: "Programmende",
          ru: "\u041F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430",
          pt: "Fim do programa",
          nl: "Programma-einde",
          fr: "Fin du programme",
          it: "Fine del programma",
          es: "Fin del programa",
          pl: "Koniec programu",
          uk: "\u041A\u0456\u043D\u0435\u0446\u044C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u8282\u76EE\u7ED3\u675F"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        def: ""
      };
      await this.createDataPoint(`${this.dev.dp}.remote.states.programEnd`, common, "state", null, null, null);
      common = {
        type: "number",
        role: "time.span",
        name: {
          en: "Program Duration",
          de: "Programmdauer",
          ru: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
          pt: "Dura\xE7\xE3o do programa",
          nl: "Programmaduur",
          fr: "Dur\xE9e du programme",
          it: "Durata del programma",
          es: "Duraci\xF3n del programa",
          pl: "Czas trwania programu",
          uk: "\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
          "zh-cn": "\u8282\u76EE\u65F6\u957F"
        },
        desc: "Create by Adapter",
        read: true,
        write: false,
        unit: "sec",
        def: 0
      };
      await this.createDataPoint(
        `${this.dev.dp}.remote.states.programDuration`,
        common,
        "state",
        null,
        null,
        null
      );
      common = {
        role: "button",
        name: {
          en: "Down",
          de: "Runter",
          ru: "\u0412\u043D\u0438\u0437",
          pt: "Abaixo",
          nl: "Omlaag",
          fr: "Vers le bas",
          it: "Gi\xF9",
          es: "Abajo",
          pl: "W d\xF3\u0142",
          uk: "\u0412\u043D\u0438\u0437",
          "zh-cn": "\u5411\u4E0B"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.down`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "Closed captioning",
          de: "Untertitelung",
          ru: "\u0421\u0443\u0431\u0442\u0438\u0442\u0440\u044B",
          pt: "Legendas ocultas",
          nl: "Ondertiteling",
          fr: "Sous-titrage cod\xE9",
          it: "Sottotitoli",
          es: "subt\xEDtulos cerrados",
          pl: "Napisy dla nies\u0142ysz\u0105cych",
          uk: "\u0421\u0443\u0431\u0442\u0438\u0442\u0440\u0438",
          "zh-cn": "\u9690\u85CF\u5F0F\u5B57\u5E55"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.cc`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: 'Literally just an "*"',
          de: 'Einfach nur ein "*"',
          ru: '\u0411\u0443\u043A\u0432\u0430\u043B\u044C\u043D\u043E \u043F\u0440\u043E\u0441\u0442\u043E "*"',
          pt: 'Literalmente apenas um "*"',
          nl: 'Letterlijk gewoon een "*"',
          fr: 'Litt\xE9ralement juste un "*"',
          it: 'Letteralmente solo un "*"',
          es: 'Literalmente s\xF3lo un "*"',
          pl: 'Dos\u0142ownie tylko "*"',
          uk: '\u0411\u0443\u043A\u0432\u0430\u043B\u044C\u043D\u043E \u043F\u0440\u043E\u0441\u0442\u043E "*"',
          "zh-cn": "\u5C31\u53EA\u662F\u4E00\u4E2A\u201C*\u201D"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.asterisk`, common, "state", false, null, null);
      common = {
        role: "button",
        name: {
          en: "The right side menu that appears with Live button",
          de: "Das rechte Seitenmen\xFC, das mit der Schaltfl\xE4che \u201ELive\u201C erscheint.",
          ru: "\u041C\u0435\u043D\u044E \u0441\u043F\u0440\u0430\u0432\u0430, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0440\u044F\u0434\u043E\u043C \u0441 \u043A\u043D\u043E\u043F\u043A\u043E\u0439 Live.",
          pt: "O menu lateral direito que aparece com o bot\xE3o Ao Vivo",
          nl: "Het menu aan de rechterkant dat verschijnt met de Live-knop.",
          fr: "Le menu lat\xE9ral droit qui appara\xEEt avec le bouton Live",
          it: "Il menu sul lato destro che appare con il pulsante Live",
          es: "El men\xFA del lado derecho que aparece con el bot\xF3n En vivo",
          pl: "Menu po prawej stronie, kt\xF3re pojawia si\u0119 z przyciskiem Na \u017Cywo",
          uk: "\u041F\u0440\u0430\u0432\u0435 \u0431\u0456\u0447\u043D\u0435 \u043C\u0435\u043D\u044E, \u044F\u043A\u0435 \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u043A\u043D\u043E\u043F\u043A\u043E\u044E \xAB\u041D\u0430\u0436\u0438\u0432\u043E\xBB",
          "zh-cn": "\u53F3\u4FA7\u83DC\u5355\u680F\u4E2D\u4F1A\u663E\u793A\u201C\u76F4\u64AD\u201D\u6309\u94AE"
        },
        type: "boolean",
        read: false,
        write: true,
        desc: "Create by Adapter",
        def: false
      };
      await this.createDataPoint(`${this.dev.dp}.remote.keys.dash`, common, "state", false, null, null);
    }
  }
  /**
   * @param ident Object
   * @param common Common States
   * @param types Object Type
   * @param value Set Value
   * @param extend Use extend or setObject
   * @param native Object Nativ
   */
  async createDataPoint(ident, common, types, value, extend, native = null) {
    try {
      const nativvalue = !native ? { native: {} } : { native };
      const obj = await this.adapter.getObjectAsync(ident);
      if (!obj) {
        await this.adapter.setObjectNotExistsAsync(ident, {
          type: types,
          common,
          ...nativvalue
        }).catch((error) => {
          if (typeof error === "string") {
            this.adapter.log.error(`createDatapoint: ${error}`);
          } else if (error instanceof Error) {
            this.adapter.log.error(`createDatapoint: ${error.name}: ${error.message}`);
          }
        });
      } else {
        if (extend) {
          this.adapter.log.debug(`INFORMATION - Extend common: ${this.adapter.namespace}.${ident}`);
          await this.adapter.extendObject(ident, {
            type: types,
            common,
            ...nativvalue
          });
          if (value != null) {
            await this.adapter.setState(ident, value, true);
          }
          return;
        }
        let ischange = false;
        if (Object.keys(obj.common).length == Object.keys(common).length) {
          for (const key in common) {
            if (obj.common[key] == null) {
              ischange = true;
              break;
            } else if (JSON.stringify(obj.common[key]) != JSON.stringify(common[key])) {
              ischange = true;
              break;
            }
          }
        } else {
          ischange = true;
        }
        if (JSON.stringify(obj.type) != JSON.stringify(types)) {
          ischange = true;
        }
        if (native) {
          if (Object.keys(obj.native).length == Object.keys(nativvalue.native).length) {
            for (const key in obj.native) {
              if (nativvalue.native[key] == null) {
                ischange = true;
                obj.native = native;
                break;
              } else if (JSON.stringify(obj.native[key]) != JSON.stringify(nativvalue.native[key])) {
                ischange = true;
                obj.native[key] = nativvalue.native[key];
                break;
              }
            }
          } else {
            ischange = true;
          }
        }
        if (ischange) {
          this.adapter.log.debug(`INFORMATION - Change common: ${this.adapter.namespace}.${ident}`);
          obj.common = common;
          obj.type = types;
          await this.adapter.setObject(ident, obj);
        }
      }
      if (value != null) {
        await this.adapter.setState(ident, value, true);
      }
    } catch (error) {
      if (typeof error === "string") {
        this.adapter.log.error(`createDataPoint: ${error}`);
      } else if (error instanceof Error) {
        this.adapter.log.error(`createDataPoint: ${error.name}: ${error.message}`);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  creatObjects
});
//# sourceMappingURL=objects.js.map
