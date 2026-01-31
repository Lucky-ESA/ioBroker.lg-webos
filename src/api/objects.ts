import { Buffer } from "node:buffer";
import type { ConfigDevice } from "../types/device";
import type { AxiosResponse, CommonStates, Objects } from "../types/object";
import type {
    LGApps,
    LGChannelList,
    LGFeatures,
    LGInput,
    LGLaunch,
    LGPictureSettings,
    LGPowerState,
    LGSystem,
    LGVolume,
    LGVolumeOld,
} from "../types/values";
import { axoisRrequest } from "./request";

/**
 * Create ioBroker objects
 */
export class creatObjects implements Objects {
    private dev: ConfigDevice;
    private adapter: ioBroker.Adapter;
    private getRequest: axoisRrequest;
    private firstStart: boolean;
    private states: { [key in string]: string } = {};

    /**
     * @param device States (Datapoints)
     * @param iob ioBroker.Adapter
     */
    constructor(
        readonly device: ConfigDevice,
        readonly iob: ioBroker.Adapter,
    ) {
        this.getRequest = new axoisRrequest();
        this.dev = device;
        this.adapter = iob;
        if (this.dev.dp == undefined) {
            this.adapter.log.error(`Missing Object ID!!!!`);
        }
        this.firstStart = true;
    }
    /**
     * Create System Pictures Settings
     *
     * @param val Pictures Settings
     */
    public async createSettings(val: LGPictureSettings): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let common: CommonStates;
            if (this.firstStart) {
                this.firstStart = false;
                common = {
                    name: {
                        en: "Settings",
                        de: "Einstellungen",
                        ru: "Настройки",
                        pt: "Configurações",
                        nl: "Setting",
                        fr: "Réglages",
                        it: "Impostazioni impostazioni",
                        es: "Ajustes",
                        pl: "Setting",
                        uk: "Налаштування",
                        "zh-cn": "确定",
                    },
                    desc: "Create by Adapter",
                    icon: "img/settings.png",
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
                            ru: "Яркость",
                            pt: "Brilho",
                            nl: "Helderheid",
                            fr: "Luminosité",
                            it: "Luminosità",
                            es: "Brillo",
                            pl: "Jasność",
                            uk: "Яскравість",
                            "zh-cn": "亮度",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        step: 1,
                        max: 100,
                        min: 0,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.brightness`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "backlight") {
                    common = {
                        type: "number",
                        role: "value",
                        name: {
                            en: "Backlight",
                            de: "Hintergrundbeleuchtung",
                            ru: "Подсветка",
                            pt: "Luz de fundo",
                            nl: "Achtergrondverlichting",
                            fr: "Rétroéclairage",
                            it: "Retroilluminazione",
                            es: "Iluminar desde el fondo",
                            pl: "Podświetlenie",
                            uk: "Підсвічування",
                            "zh-cn": "背光",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        step: 1,
                        max: 100,
                        min: 0,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.backlight`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "contrast") {
                    common = {
                        type: "number",
                        role: "value",
                        name: {
                            en: "Contrast",
                            de: "Kontrast",
                            ru: "Контраст",
                            pt: "Contraste",
                            nl: "Contrast",
                            fr: "Contraste",
                            it: "Contrasto",
                            es: "Contraste",
                            pl: "Kontrast",
                            uk: "Контраст",
                            "zh-cn": "对比",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        step: 1,
                        max: 100,
                        min: 0,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.contrast`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "color") {
                    common = {
                        type: "number",
                        role: "value",
                        name: {
                            en: "Color",
                            de: "Farbe",
                            ru: "Цвет",
                            pt: "Cor",
                            nl: "Kleur",
                            fr: "Couleur",
                            it: "Colore",
                            es: "Color",
                            pl: "Kolor",
                            uk: "Колір",
                            "zh-cn": "颜色",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        step: 1,
                        max: 100,
                        min: 0,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.color`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "pictureMode") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Picture Mode",
                            de: "Bildmodus",
                            ru: "Режим изображения",
                            pt: "Modo de imagem",
                            nl: "Fotomodus",
                            fr: "Mode image",
                            it: "Modalità immagine",
                            es: "Modo de imagen",
                            pl: "Tryb obrazu",
                            uk: "Режим зображення",
                            "zh-cn": "图片模式",
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
                            vivid: "Vivid",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.pictureMode`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "smoothGradation") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Smooth Gradation",
                            de: "Sanfter Übergang",
                            ru: "Плавный переход",
                            pt: "Graduação suave",
                            nl: "Vloeiende overgang",
                            fr: "Dégradé lisse",
                            it: "Gradazione uniforme",
                            es: "Gradación suave",
                            pl: "Płynna gradacja",
                            uk: "Плавна градація",
                            "zh-cn": "平滑渐变",
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
                            auto: "Auto",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.smoothGradation`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "mpegNoiseReduction") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "MPEG Noise Reduction",
                            de: "MPEG-Rauschunterdrückung",
                            ru: "Снижение шума MPEG",
                            pt: "Redução de ruído MPEG",
                            nl: "MPEG-ruisonderdrukking",
                            fr: "Réduction du bruit MPEG",
                            it: "Riduzione del rumore MPEG",
                            es: "Reducción de ruido MPEG",
                            pl: "Redukcja szumów MPEG",
                            uk: "Зменшення шуму MPEG",
                            "zh-cn": "MPEG降噪",
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
                            auto: "Auto",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.mpegNoiseReduction`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "deviceName") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Device Name",
                            de: "Gerätename",
                            ru: "Название устройства",
                            pt: "Nome do dispositivo",
                            nl: "Apparaatnaam",
                            fr: "Nom de l'appareil",
                            it: "Nome del dispositivo",
                            es: "Nombre del dispositivo",
                            pl: "Nazwa urządzenia",
                            uk: "Назва пристрою",
                            "zh-cn": "设备名称",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: "",
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.deviceName`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "wolwowlOnOff") {
                    common = {
                        type: "boolean",
                        role: "switch",
                        name: {
                            en: "Wake on lan On/Off",
                            de: "Wake-on-LAN ein/aus",
                            ru: "Включение/выключение функции пробуждения по локальной сети",
                            pt: "Wake on lan Ligado/Desligado",
                            nl: "Wake-on-LAN aan/uit",
                            fr: "Activation/désactivation du Wake on LAN",
                            it: "Wake on LAN attivato/disattivato",
                            es: "Activación/desactivación de Wake on LAN",
                            pl: "Włącz/wyłącz funkcję Wake on LAN",
                            uk: "Увімкнення/вимкнення пробудження по локальній мережі",
                            "zh-cn": "网络唤醒功能开/关",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: false,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.wolwowlOnOff`,
                        common,
                        "state",
                        val.payload.settings[attribute] == "true" ? true : false,
                        null,
                        null,
                    );
                } else if (attribute == "energySaving") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Energy Saving",
                            de: "Energiesparen",
                            ru: "Энергосбережение",
                            pt: "Economia de energia",
                            nl: "Energiebesparing",
                            fr: "Économies d'énergie",
                            it: "Risparmio energetico",
                            es: "Ahorro de energía",
                            pl: "Oszczędność energii",
                            uk: "Енергозбереження",
                            "zh-cn": "节能",
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
                            max: "Maximum",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.energySaving`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "sharpness") {
                    common = {
                        type: "number",
                        role: "value",
                        name: {
                            en: "Sharpness",
                            de: "Schärfe",
                            ru: "Острота",
                            pt: "Nitidez",
                            nl: "Scherpte",
                            fr: "Acuité",
                            it: "Nitidezza",
                            es: "Nitidez",
                            pl: "Ostrość",
                            uk: "Різкість",
                            "zh-cn": "清晰度",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        max: 50,
                        min: 0,
                        step: 1,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.sharpness`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "dynamicContrast") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Dynamic contrast",
                            de: "Dynamischer Kontrast",
                            ru: "Динамический контраст",
                            pt: "Contraste dinâmico",
                            nl: "Dynamisch contrast",
                            fr: "Contraste dynamique",
                            it: "Contrasto dinamico",
                            es: "Contraste dinámico",
                            pl: "Kontrast dynamiczny",
                            uk: "Динамічний контраст",
                            "zh-cn": "动态对比",
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
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.dynamicContrast`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "peakBrightness") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Peak brightness",
                            de: "Spitzenhelligkeit",
                            ru: "Максимальная яркость",
                            pt: "Brilho máximo",
                            nl: "Maximale helderheid",
                            fr: "luminosité maximale",
                            it: "luminosità massima",
                            es: "Brillo máximo",
                            pl: "Maksymalna jasność",
                            uk: "Пікова яскравість",
                            "zh-cn": "峰值亮度",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: "off",
                        states: {
                            off: "Off",
                            high: "High",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.peakBrightness`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "blackLevel") {
                    common = {
                        type: "string",
                        role: "json",
                        name: {
                            en: "Black level",
                            de: "Schwarzpegel",
                            ru: "Черный уровень",
                            pt: "Nível preto",
                            nl: "Zwartniveau",
                            fr: "Niveau noir",
                            it: "Livello del nero",
                            es: "Nivel negro",
                            pl: "Poziom czerni",
                            uk: "Рівень чорного",
                            "zh-cn": "黑电平",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: "{}",
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.blackLevel`,
                        common,
                        "state",
                        JSON.stringify(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "gamma") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Gamma",
                            de: "Gamma",
                            ru: "Гамма",
                            pt: "Gama",
                            nl: "Gamma",
                            fr: "Gamma",
                            it: "Gamma",
                            es: "Gama",
                            pl: "Gamma",
                            uk: "Гамма",
                            "zh-cn": "伽马",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: "medium",
                        states: {
                            low: "Low",
                            medium: "Medium",
                            high1: "High Level 1",
                            high2: "High Level 2",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.gamma`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "motionEyeCare") {
                    common = {
                        type: "boolean",
                        role: "switch",
                        name: {
                            en: "Motion eye Care",
                            de: "Augenpflege",
                            ru: "Уход за глазами при движении",
                            pt: "Cuidados com os olhos em movimento",
                            nl: "Bewegingsoogverzorging",
                            fr: "Soins oculaires en mouvement",
                            it: "Cura degli occhi in movimento",
                            es: "Cuidado ocular con movimiento",
                            pl: "Opieka nad oczami w ruchu",
                            uk: "Догляд за очима за рухом",
                            "zh-cn": "动态眼科护理",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: false,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.motionEyeCare`,
                        common,
                        "state",
                        val.payload.settings[attribute] == "on" ? true : false,
                        null,
                        null,
                    );
                } else if (attribute == "colorGamut") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Color gamut",
                            de: "Farbraum",
                            ru: "Цветовая гамма",
                            pt: "gama de cores",
                            nl: "Kleurengamma",
                            fr: "Gamme de couleurs",
                            it: "Gamma di colori",
                            es: "Gama de colores",
                            pl: "Gama kolorów",
                            uk: "Колірна гама",
                            "zh-cn": "色域",
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
                            dynamic: "Dynamic",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.colorGamut`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "hdrDynamicToneMapping") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "HDR dynamic tone mapping",
                            de: "HDR-dynamisches Tone Mapping",
                            ru: "HDR динамическое тональное отображение",
                            pt: "mapeamento de tons dinâmico HDR",
                            nl: "HDR dynamische toonmapping",
                            fr: "cartographie dynamique des tons HDR",
                            it: "Mappatura dinamica dei toni HDR",
                            es: "Mapeo dinámico de tonos HDR",
                            pl: "Dynamiczne mapowanie tonów HDR",
                            uk: "Динамічне відображення тонів HDR",
                            "zh-cn": "HDR动态色调映射",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: "off",
                        states: {
                            off: "Off",
                            on: "On",
                            HGIG: "HGIG",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.hdrDynamicToneMapping`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "realCinema") {
                    common = {
                        type: "boolean",
                        role: "switch",
                        name: {
                            en: "Real cinema",
                            de: "Echtes Kino",
                            ru: "Настоящее кино",
                            pt: "Cinema de verdade",
                            nl: "Echte cinema",
                            fr: "Le vrai cinéma",
                            it: "Il vero cinema",
                            es: "Cine real",
                            pl: "Prawdziwe kino",
                            uk: "Справжнє кіно",
                            "zh-cn": "真实电影",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: false,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.realCinema`,
                        common,
                        "state",
                        val.payload.settings[attribute] == "on" ? true : false,
                        null,
                        null,
                    );
                } else if (attribute == "tint") {
                    common = {
                        type: "number",
                        role: "value",
                        name: {
                            en: "tint",
                            de: "Farbton",
                            ru: "оттенок",
                            pt: "matiz",
                            nl: "tint",
                            fr: "teinte",
                            it: "tinta",
                            es: "tinte",
                            pl: "odcień",
                            uk: "відтінок",
                            "zh-cn": "着色",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        max: 50,
                        min: -50,
                        step: 1,
                        def: 0,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.tint`,
                        common,
                        "state",
                        Number(val.payload.settings[attribute]),
                        null,
                        null,
                    );
                } else if (attribute == "noiseReduction") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Noise Reduction",
                            de: "Geräuschreduzierung",
                            ru: "Снижение уровня шума",
                            pt: "Redução de ruído",
                            nl: "Geluidsreductie",
                            fr: "Réduction du bruit",
                            it: "Riduzione del rumore",
                            es: "Reducción de ruido",
                            pl: "Redukcja hałasu",
                            uk: "Зменшення шуму",
                            "zh-cn": "降噪",
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
                            auto: "Auto",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.noiseReduction`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "dynamicColor") {
                    common = {
                        type: "string",
                        role: "state",
                        name: {
                            en: "Dynamic Color",
                            de: "Dynamische Farben",
                            ru: "Динамический цвет",
                            pt: "Cores dinâmicas",
                            nl: "Dynamische kleur",
                            fr: "Couleur dynamique",
                            it: "Colore dinamico",
                            es: "Color dinámico",
                            pl: "Dynamiczny kolor",
                            uk: "Динамічний колір",
                            "zh-cn": "动态色彩",
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
                            user: "User",
                        },
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.dynamicColor`,
                        common,
                        "state",
                        val.payload.settings[attribute],
                        null,
                        null,
                    );
                } else if (attribute == "eyeComfortMode") {
                    common = {
                        type: "boolean",
                        role: "switch",
                        name: {
                            en: "Eye Comfort Mode",
                            de: "Augenkomfortmodus",
                            ru: "Режим комфорта для глаз",
                            pt: "Modo de conforto para os olhos",
                            nl: "Oogcomfortmodus",
                            fr: "Mode confort des yeux",
                            it: "Modalità comfort per gli occhi",
                            es: "Modo confort visual",
                            pl: "Tryb komfortu dla oczu",
                            uk: "Режим комфорту для очей",
                            "zh-cn": "护眼模式",
                        },
                        desc: "Create by Adapter",
                        read: true,
                        write: true,
                        def: false,
                    };
                    await this.createDataPoint(
                        `${this.dev.dp}.remote.settings.eyeComfortMode`,
                        common,
                        "state",
                        val.payload.settings[attribute] == "on" ? true : false,
                        null,
                        null,
                    );
                }
            }
        }
    }
    /**
     * Create connection for pointer events
     */
    public async createPointerConnection(): Promise<void> {
        if (this.dev.dp != undefined) {
            const common: CommonStates = {
                type: "boolean",
                role: "indicator.connected",
                name: {
                    en: "Pointer connection",
                    de: "Zeigerverbindung",
                    ru: "Соединение указателя",
                    pt: "Conexão de ponteiro",
                    nl: "Pointerverbinding",
                    fr: "Connexion de pointeur",
                    it: "Connessione del puntatore",
                    es: "Conexión de puntero",
                    pl: "Połączenie wskaźnika",
                    uk: "З'єднання вказівника",
                    "zh-cn": "指针连接",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.status.pointerConnection`, common, "state", false, null, null);
        }
    }
    /**
     * Create Info power state
     *
     * @param val Power State
     */
    public async createPowerState(val: LGPowerState): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined && val.payload.state != undefined) {
            const common: CommonStates = {
                type: "string",
                role: "state",
                name: {
                    en: "Power state",
                    de: "Energiezustand",
                    ru: "Состояние мощности",
                    pt: "Estado de energia",
                    nl: "Stroomtoestand",
                    fr: "État de puissance",
                    it: "Stato di potenza",
                    es: "Estado de potencia",
                    pl: "Stan zasilania",
                    uk: "Стан живлення",
                    "zh-cn": "电源状态",
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
                    "Screen Saver": "Screen saver is active",
                },
            };
            await this.createDataPoint(
                `${this.dev.dp}.status.powerState`,
                common,
                "state",
                val.payload.state,
                null,
                null,
            );
        }
    }
    /**
     * Create App Buttons
     *
     * @param val App Name
     * @param url URL Icon
     */
    private async createAppButton(val: string, url: string | null): Promise<void> {
        let icons: any;
        this.adapter.log.debug(JSON.stringify(url));
        if (url && this.dev.dp != undefined) {
            const oldFile = await this.adapter.fileExistsAsync(
                `${this.adapter.namespace}`,
                `${this.dev.dp}/${val}.png`,
            );
            if (!oldFile) {
                const resp: AxiosResponse = await this.getRequest.get(url);
                icons = null;
                if (typeof resp === "object" && resp.data) {
                    const file = url.split(".");
                    const ext = file.pop();
                    await this.adapter.writeFileAsync(
                        `${this.adapter.namespace}`,
                        `${this.dev.dp}/${val}.${ext}`,
                        resp.data,
                    );
                    const mime = Buffer.from(resp.data).toString("base64");
                    icons = { icon: `data:${resp.data.mimeType};base64,${mime}` };
                } else {
                    this.adapter.log.error(`ICON ERROR: ${JSON.stringify(resp)}`);
                }
            } else {
                const { file, mimeType } = await this.adapter.readFileAsync(
                    this.adapter.namespace,
                    `${this.dev.dp}/${val}.png`,
                );
                if (file && mimeType) {
                    const mime = Buffer.from(file).toString("base64");
                    icons = { icon: `data:${mimeType};base64,${mime}` };
                }
            }
        }
        if (this.dev.dp != undefined) {
            let common: CommonStates;
            if (val === "amazon") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Amazon Prime APP",
                        de: "Öffnen der Amazon Prime App",
                        ru: "Открытие приложения Amazon Prime",
                        pt: "Abrindo o aplicativo Amazon Prime",
                        nl: "Amazon Prime-app openen",
                        fr: "Ouverture de l'application Amazon Prime",
                        it: "Apertura dell'APP Amazon Prime",
                        es: "Abrir la aplicación Amazon Prime",
                        pl: "Otwieranie aplikacji Amazon Prime",
                        uk: "Відкриття застосунку Amazon Prime",
                        "zh-cn": "打开亚马逊Prime应用程序",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.amazon`, common, "state", false, null, null);
            } else if (val === "joyn") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Joyn APP",
                        de: "Joyn-App öffnen",
                        ru: "Открытие приложения Joyn",
                        pt: "Abrindo o aplicativo Joyn",
                        nl: "De Joyn-app openen",
                        fr: "Ouverture de l'application Joyn",
                        it: "Apertura dell'APP Joyn",
                        es: "Abrir la aplicación Joyn",
                        pl: "Otwieranie aplikacji Joyn",
                        uk: "Відкриття застосунку Joyn",
                        "zh-cn": "打开 Joyn APP",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.joyn`, common, "state", false, null, null);
            } else if (val === "alexa") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Amazon Alexa APP",
                        de: "Öffnen der Amazon Alexa App",
                        ru: "Открытие приложения Amazon Alexa",
                        pt: "Abrindo o aplicativo Amazon Alexa",
                        nl: "Amazon Alexa-app openen",
                        fr: "Ouverture de l'application Amazon Alexa",
                        it: "Apertura dell'APP Amazon Alexa",
                        es: "Abrir la aplicación Amazon Alexa",
                        pl: "Otwieranie aplikacji Amazon Alexa",
                        uk: "Відкриття застосунку Amazon Alexa",
                        "zh-cn": "打开亚马逊 Alexa 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(
                    `${this.dev.dp}.remote.keys.amazonAlexa`,
                    common,
                    "state",
                    false,
                    null,
                    null,
                );
            } else if (val === "youtube") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Youtube APP",
                        de: "YouTube-App öffnen",
                        ru: "Открытие приложения YouTube",
                        pt: "Abrindo o aplicativo do YouTube",
                        nl: "De YouTube-app openen",
                        fr: "Ouverture de l'application YouTube",
                        it: "Apertura dell'APP Youtube",
                        es: "Abriendo la aplicación de Youtube",
                        pl: "Otwieranie aplikacji Youtube",
                        uk: "Відкриття програми YouTube",
                        "zh-cn": "打开 YouTube 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.youtube`, common, "state", false, null, null);
            } else if (val === "netflix") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Netflix APP",
                        de: "Netflix-App öffnen",
                        ru: "Открытие приложения Netflix",
                        pt: "Abrindo o aplicativo da Netflix",
                        nl: "De Netflix-app openen",
                        fr: "Ouverture de l'application Netflix",
                        it: "Apertura dell'APP Netflix",
                        es: "Abrir la aplicación de Netflix",
                        pl: "Otwieranie aplikacji Netflix",
                        uk: "Відкриття програми Netflix",
                        "zh-cn": "打开 Netflix 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.netflix`, common, "state", false, null, null);
            } else if (val === "disney") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Disney+ APP",
                        de: "Disney+ App öffnen",
                        ru: "Открытие приложения Disney+",
                        pt: "Abrindo o aplicativo Disney+",
                        nl: "Disney+ app openen",
                        fr: "Ouverture de l'application Disney+",
                        it: "Apertura dell'APP Disney+",
                        es: "Abrir la aplicación Disney+",
                        pl: "Otwieranie aplikacji Disney+",
                        uk: "Відкриття застосунку Disney+",
                        "zh-cn": "打开 Disney+ 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.disneyPlus`, common, "state", false, null, null);
            } else if (val === "rtl") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening RTL+ APP",
                        de: "Öffnen der RTL+-App",
                        ru: "Открытие приложения RTL+",
                        pt: "Abrindo o aplicativo RTL+",
                        nl: "De RTL+ app openen",
                        fr: "Ouverture de l'application RTL+",
                        it: "Apertura dell'APP RTL+",
                        es: "Abrir la aplicación RTL+",
                        pl: "Otwieranie aplikacji RTL+",
                        uk: "Відкриття програми RTL+",
                        "zh-cn": "打开 RTL+ 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.keys.rtlPlus`, common, "state", false, null, null);
            } else if (val === "apple") {
                common = {
                    role: "button",
                    name: {
                        en: "Opening Apple-TV APP",
                        de: "Öffnen der Apple TV App",
                        ru: "Открытие приложения Apple TV",
                        pt: "Abrindo o aplicativo Apple TV",
                        nl: "De Apple TV-app openen",
                        fr: "Ouverture de l'application Apple TV",
                        it: "Apertura dell'APP Apple-TV",
                        es: "Abrir la aplicación Apple TV",
                        pl: "Otwieranie aplikacji Apple TV",
                        uk: "Відкриття програми Apple TV",
                        "zh-cn": "打开 Apple TV 应用",
                    },
                    type: "boolean",
                    read: false,
                    write: true,
                    desc: "Create by Adapter",
                    def: false,
                    ...icons,
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
    public async createApps(val: LGApps): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            this.states.unknown = "Unknown";
            for (const input of val.payload.apps) {
                if (!this.states[input.id]) {
                    this.states[input.id] = input.title;
                }
            }
            const common: CommonStates = {
                type: "string",
                role: "state",
                name: {
                    en: "Launch",
                    de: "Start",
                    ru: "Запуск",
                    pt: "Lançar",
                    nl: "Launch",
                    fr: "Lancement",
                    it: "Lancio",
                    es: "Lanzamiento",
                    pl: "Początek",
                    uk: "Запуск",
                    "zh-cn": "发射",
                },
                desc: "Create by Adapter",
                read: true,
                write: true,
                def: "unknown",
                states: this.states,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.launch`, common, "state", "unknown", null, null);
        }
    }

    /**
     * Create Launch State
     *
     * @param val Launch
     */
    public async createLaunch(val: LGLaunch): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
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
            const common: CommonStates = {
                type: "string",
                role: "state",
                name: {
                    en: "Launch",
                    de: "Start",
                    ru: "Запуск",
                    pt: "Lançar",
                    nl: "Launch",
                    fr: "Lancement",
                    it: "Lancio",
                    es: "Lanzamiento",
                    pl: "Początek",
                    uk: "Запуск",
                    "zh-cn": "发射",
                },
                desc: "Create by Adapter",
                read: true,
                write: true,
                def: "unknown",
                states: this.states,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.launch`, common, "state", "unknown", null, null);
        }
    }

    /**
     * Create System State
     *
     * @param val System
     */
    public async createSystem(val: LGSystem): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let common: CommonStates;
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Product name",
                    de: "Produktname",
                    ru: "Название продукта",
                    pt: "Nome do produto",
                    nl: "Productnaam",
                    fr: "Nom du produit",
                    it: "Nome del prodotto",
                    es: "Nombre del producto",
                    pl: "Nazwa produktu",
                    uk: "Назва продукту",
                    "zh-cn": "产品名称",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.product_name`,
                common,
                "state",
                val.payload.product_name,
                null,
                null,
            );
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Model name",
                    de: "Modellname",
                    ru: "Название модели",
                    pt: "Nome do modelo",
                    nl: "Modelnaam",
                    fr: "Nom du modèle",
                    it: "Nome del modello",
                    es: "Nombre del modelo",
                    pl: "Nazwa modelu",
                    uk: "Назва моделі",
                    "zh-cn": "型号名称",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.model_name`,
                common,
                "state",
                val.payload.model_name,
                null,
                null,
            );
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Country",
                    de: "Land",
                    ru: "Страна",
                    pt: "País",
                    nl: "Land",
                    fr: "Pays",
                    it: "Paese",
                    es: "País",
                    pl: "Kraj",
                    uk: "Країна",
                    "zh-cn": "国家",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.country`,
                common,
                "state",
                val.payload.country,
                null,
                null,
            );
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Language code",
                    de: "Sprachcode",
                    ru: "Языковой код",
                    pt: "Código de idioma",
                    nl: "Taalcode",
                    fr: "Code de langue",
                    it: "Codice della lingua",
                    es: "Código de idioma",
                    pl: "Kod języka",
                    uk: "Код мови",
                    "zh-cn": "语言代码",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.language_code`,
                common,
                "state",
                val.payload.language_code,
                null,
                null,
            );
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "MAC address",
                    de: "MAC-Adresse",
                    ru: "MAC-адрес",
                    pt: "Endereço MAC",
                    nl: "MAC-adres",
                    fr: "Adresse MAC",
                    it: "indirizzo MAC",
                    es: "Dirección MAC",
                    pl: "Adres MAC",
                    uk: "MAC-адреса",
                    "zh-cn": "MAC地址",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.system.mac`, common, "state", val.payload.device_id, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Firmware major version",
                    de: "Firmware-Hauptversion",
                    ru: "основная версия прошивки",
                    pt: "versão principal do firmware",
                    nl: "Firmware hoofdversie",
                    fr: "Version majeure du firmware",
                    it: "Versione principale del firmware",
                    es: "Versión principal del firmware",
                    pl: "Główna wersja oprogramowania sprzętowego",
                    uk: "Основна версія прошивки",
                    "zh-cn": "固件主版本",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.major_ver`,
                common,
                "state",
                val.payload.major_ver,
                null,
                null,
            );
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Firmware minor version",
                    de: "Firmware-Nebenversion",
                    ru: "минорная версия прошивки",
                    pt: "versão secundária do firmware",
                    nl: "Firmware minor-versie",
                    fr: "Version mineure du firmware",
                    it: "Versione secondaria del firmware",
                    es: "Versión secundaria del firmware",
                    pl: "Wersja pomocnicza oprogramowania sprzętowego",
                    uk: "Мінорна версія прошивки",
                    "zh-cn": "固件次版本",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(
                `${this.dev.dp}.system.minor_ver`,
                common,
                "state",
                val.payload.minor_ver,
                null,
                null,
            );
        }
    }

    /**
     * Create features e.g. 3D Object
     *
     * @param val Features
     */
    public async createFeatures(val: LGFeatures): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            if (
                (val.payload.features && val.payload.features["3d"]) ||
                (val.payload.configs && val.payload.configs["tv.model.3dSupportType"] == "3D")
            ) {
                const common: CommonStates = {
                    type: "boolean",
                    role: "switch",
                    name: {
                        en: "3D Mode on/off",
                        de: "3D-Modus ein/aus",
                        ru: "Включение/выключение 3D-режима",
                        pt: "Modo 3D ativado/desativado",
                        nl: "3D-modus aan/uit",
                        fr: "Mode 3D activé/désactivé",
                        it: "Modalità 3D attivata/disattivata",
                        es: "Modo 3D activado/desactivado",
                        pl: "Włączanie/wyłączanie trybu 3D",
                        uk: "3D-режим увімкнено/вимкнено",
                        "zh-cn": "3D模式开/关",
                    },
                    desc: "Create by Adapter",
                    read: true,
                    write: true,
                    def: false,
                };
                await this.createDataPoint(`${this.dev.dp}.remote.states.3dmode`, common, "state", false, null, null);
            }
            if (
                (val.payload.receiverType != null && val.payload.receiverType != "") ||
                (val.payload.configs && val.payload.configs["tv.model.sysType"] != "")
            ) {
                let receiverType = "";
                if (val.payload.receiverType != null && val.payload.receiverType != "") {
                    receiverType = val.payload.receiverType;
                }
                if (val.payload.configs && val.payload.configs["tv.model.sysType"] != "") {
                    receiverType = val.payload.configs["tv.model.sysType"];
                }
                const common: CommonStates = {
                    type: "string",
                    role: "state",
                    name: {
                        en: "Receiver Type",
                        de: "Empfängertyp",
                        ru: "Тип приемника",
                        pt: "Tipo de receptor",
                        nl: "Ontvangertype",
                        fr: "Type de récepteur",
                        it: "Tipo di ricevitore",
                        es: "Tipo de receptor",
                        pl: "Typ odbiornika",
                        uk: "Тип приймача",
                        "zh-cn": "接收器类型",
                    },
                    desc: "Create by Adapter",
                    read: true,
                    write: false,
                    def: "",
                };
                await this.createDataPoint(
                    `${this.dev.dp}.system.receiverType`,
                    common,
                    "state",
                    receiverType,
                    null,
                    null,
                );
            }
            if (
                (val.payload.modelName != null && val.payload.modelName != "") ||
                (val.payload.configs && val.payload.configs["tv.model.modelname"] != "")
            ) {
                let modelName = "";
                if (val.payload.modelName != null && val.payload.modelName != "") {
                    modelName = val.payload.modelName;
                }
                if (val.payload.configs && val.payload.configs["tv.model.modelname"] != "") {
                    modelName = val.payload.configs["tv.model.modelname"];
                }
                const common: CommonStates = {
                    type: "string",
                    role: "state",
                    name: {
                        en: "Receiver Type",
                        de: "Empfängertyp",
                        ru: "Тип приемника",
                        pt: "Tipo de receptor",
                        nl: "Ontvangertype",
                        fr: "Type de récepteur",
                        it: "Tipo di ricevitore",
                        es: "Tipo de receptor",
                        pl: "Typ odbiornika",
                        uk: "Тип приймача",
                        "zh-cn": "接收器类型",
                    },
                    desc: "Create by Adapter",
                    read: true,
                    write: false,
                    def: "",
                };
                await this.createDataPoint(`${this.dev.dp}.system.modelName`, common, "state", modelName, null, null);
            }
            if (val.payload.configs && val.payload.configs["tv.model.serialnumber"] != "") {
                const common: CommonStates = {
                    type: "string",
                    role: "state",
                    name: {
                        en: "Serial number",
                        de: "Seriennummer",
                        ru: "Серийный номер",
                        pt: "Número de série",
                        nl: "Serienummer",
                        fr: "Numéro de série",
                        it: "Numero di serie",
                        es: "Número de serie",
                        pl: "Numer seryjny",
                        uk: "Серійний номер",
                        "zh-cn": "序列号",
                    },
                    desc: "Create by Adapter",
                    read: true,
                    write: false,
                    def: "",
                };
                await this.createDataPoint(
                    `${this.dev.dp}.system.serialNumber`,
                    common,
                    "state",
                    val.payload.configs["tv.model.serialnumber"],
                    null,
                    null,
                );
            }
        }
    }

    /**
     * Create input State
     *
     * @param val Input
     */
    public async createInput(val: LGInput): Promise<void> {
        if (
            this.dev.dp != undefined &&
            val.payload != undefined &&
            val.payload.devices != undefined &&
            val.payload.devices[0] != undefined &&
            val.payload.devices[0].id != undefined
        ) {
            let states: { [key in string]: string } = {};
            states = { unknown: "Unknown" };
            let appId = "";
            for (const input of val.payload.devices) {
                if (input.hdmiPlugIn) {
                    appId = input.appId;
                }
                states[input.appId] = input.label;
            }
            const common: CommonStates = {
                type: "string",
                role: "state",
                name: {
                    en: "Input",
                    de: "Eingang",
                    ru: "Вход",
                    pt: "Entrada",
                    nl: "Invoer",
                    fr: "Saisir",
                    it: "Ingresso",
                    es: "Aporte",
                    pl: "Wejście",
                    uk: "Вхід",
                    "zh-cn": "输入",
                },
                desc: "Create by Adapter",
                read: true,
                write: true,
                def: "unknown",
                states: states,
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
    public async createChannelList(val: LGChannelList): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let channel: { [key in string]: string } = {};
            let channelId: { [key in string]: string } = {};
            channel = { unknown: "Unknown" };
            channelId = { unknown: "Unknown" };
            for (const input of val.payload.channelList) {
                channel[Number(input.channelNumber)] = input.channelName;
                channelId[input.channelId] = input.channelName;
            }
            await this.adapter.extendObject(`${this.dev.dp}.remote.states.channelId`, {
                common: { states: channelId },
            });
            await this.adapter.extendObject(`${this.dev.dp}.remote.states.channel`, { common: { states: channel } });
        }
    }

    /**
     * Create Volume State
     *
     * @param val Volume
     */
    public async createOutput(val: LGVolume): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let common: CommonStates;
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Input",
                    de: "Eingang",
                    ru: "Вход",
                    pt: "Entrada",
                    nl: "Invoer",
                    fr: "Saisir",
                    it: "Ingresso",
                    es: "Aporte",
                    pl: "Wejście",
                    uk: "Вхід",
                    "zh-cn": "输入",
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
                    external_speaker: "External Speaker",
                },
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.states.soundOutput`,
                common,
                "state",
                val.payload.volumeStatus.soundOutput,
                null,
                null,
            );
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "TV Volume",
                    de: "TV Volumen",
                    ru: "Объем ТВ",
                    pt: "Volume de TV",
                    nl: "TV Volum",
                    fr: "Volume TV",
                    it: "Volume TV",
                    es: "Volumen de TV",
                    pl: "Volume TV",
                    uk: "Телевізор",
                    "zh-cn": "电视电影",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                min: 0,
                max: val.payload.volumeStatus.maxVolume,
                step: 1,
                def: 0,
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.states.volume`,
                common,
                "state",
                val.payload.volumeStatus.volume,
                null,
                null,
            );
            if (val.payload.volumeStatus.muteStatus) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
                    val: val.payload.volumeStatus.muteStatus,
                    ack: true,
                });
            }
        }
    }

    /**
     * Create Volume State old TV´s
     *
     * @param val Volume
     */
    public async createOutputOld(val: LGVolumeOld): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let common: CommonStates;
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Input",
                    de: "Eingang",
                    ru: "Вход",
                    pt: "Entrada",
                    nl: "Invoer",
                    fr: "Saisir",
                    it: "Ingresso",
                    es: "Aporte",
                    pl: "Wejście",
                    uk: "Вхід",
                    "zh-cn": "输入",
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
                    external_speaker: "External Speaker",
                },
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.states.soundOutput`,
                common,
                "state",
                val.payload.scenario,
                null,
                null,
            );
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "TV Volume",
                    de: "TV Volumen",
                    ru: "Объем ТВ",
                    pt: "Volume de TV",
                    nl: "TV Volum",
                    fr: "Volume TV",
                    it: "Volume TV",
                    es: "Volumen de TV",
                    pl: "Volume TV",
                    uk: "Телевізор",
                    "zh-cn": "电视电影",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                min: 0,
                max: 100,
                step: 1,
                def: 0,
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.states.volume`,
                common,
                "state",
                val.payload.volume,
                null,
                null,
            );
            if (val.payload.muted != null || val.payload.mute != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
                    val: val.payload.muted ? val.payload.muted : val.payload.mute,
                    ack: true,
                });
            }
        }
    }

    /**
     * Create Device, Channels and States
     */
    public async createDevice(): Promise<void> {
        if (this.dev.dp != undefined) {
            let common: CommonStates;
            common = {
                name: this.dev.tvname != null ? this.dev.tvname : "",
                desc: this.dev.tvname != null ? this.dev.tvname : "",
                statusStates: {
                    onlineId: `${this.adapter.namespace}.${this.dev.dp}.status.online`,
                },
                icon: "",
            };
            await this.createDataPoint(this.dev.dp, common, "device", null, null, null);
            common = {
                name: {
                    en: "Status",
                    de: "Status",
                    ru: "Статус",
                    pt: "Estado",
                    nl: "Status",
                    fr: "État",
                    it: "Stato",
                    es: "Situación",
                    pl: "Status",
                    uk: "Статус на сервери",
                    "zh-cn": "现状",
                },
                desc: "Create by Adapter",
                icon: "img/status.png",
            };
            await this.createDataPoint(`${this.dev.dp}.status`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "Remote Control",
                    de: "Fernsteuerung",
                    ru: "Дистанционное управление",
                    pt: "Controle remoto",
                    nl: "Verwijder controle",
                    fr: "Télécommande",
                    it: "Controllo remoto",
                    es: "Control remoto",
                    pl: "Kontrola Pamięci",
                    uk: "Пульт дистанційного керування",
                    "zh-cn": "遥感",
                },
                desc: "Create by Adapter",
                icon: "img/fernbedienung.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "Remote control buttons",
                    de: "Fernbedienungstasten",
                    ru: "Удаленные кнопки управления",
                    pt: "Botões de controle remoto",
                    nl: "Verwijder controle knoppen",
                    fr: "Boutons de commande à distance",
                    it: "Pulsanti di controllo remoto",
                    es: "Botones de control remoto",
                    pl: "Klucze kontrolne",
                    uk: "Кнопки дистанційного керування",
                    "zh-cn": "遥控区",
                },
                desc: "Create by Adapter",
                icon: "img/keys.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "Mouse Cursor",
                    de: "Mauszeiger",
                    ru: "Курсор мыши",
                    pt: "Cursor do mouse",
                    nl: "Muiscursor",
                    fr: "Curseur de la souris",
                    it: "Cursore del mouse",
                    es: "Cursor del ratón",
                    pl: "Kursor myszy",
                    uk: "Курсор миші",
                    "zh-cn": "鼠标光标",
                },
                desc: "Create by Adapter",
                icon: "img/cursor.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.cursor`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "Notifications",
                    de: "Benachrichtigungen",
                    ru: "Уведомления",
                    pt: "Notificações",
                    nl: "Verklaringen",
                    fr: "Notifications",
                    it: "Notifiche",
                    es: "Notificaciones",
                    pl: "Uwaga",
                    uk: "Повідомлення",
                    "zh-cn": "通知",
                },
                desc: "Create by Adapter",
                icon: "img/notify.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.notify`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "own request",
                    de: "eigene Anfrage",
                    ru: "собственный запрос",
                    pt: "pedido próprio",
                    nl: "een verzoek",
                    fr: "propre demande",
                    it: "propria richiesta",
                    es: "propia solicitud",
                    pl: "żądanie",
                    uk: "власний запит",
                    "zh-cn": "自己的请求",
                },
                desc: "Create by Adapter",
                icon: "img/own_request.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.own_request`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "Object states",
                    de: "Objektzustände",
                    ru: "Состояния объектов",
                    pt: "Estados de objeto",
                    nl: "Objectstaten",
                    fr: "États de l'objet",
                    it: "Stati degli oggetti",
                    es: "Estados de objeto",
                    pl: "Stany obiektów",
                    uk: "Стан об'єкта",
                    "zh-cn": "对象状态",
                },
                desc: "Create by Adapter",
                icon: "img/states.png",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states`, common, "channel", null, null, null);
            common = {
                name: {
                    en: "System",
                    de: "System",
                    ru: "Система",
                    pt: "Sistema",
                    nl: "Systeem",
                    fr: "Système",
                    it: "Sistema",
                    es: "Sistema",
                    pl: "System",
                    uk: "Система",
                    "zh-cn": "系统",
                },
                desc: "Create by Adapter",
                icon: "img/settings.png",
            };
            await this.createDataPoint(`${this.dev.dp}.system`, common, "channel", null, null, null);
            common = {
                type: "boolean",
                role: "button",
                name: {
                    en: "Mouse Cursor click",
                    de: "Mausklick",
                    ru: "Щелчок курсором мыши",
                    pt: "Clique do cursor do mouse",
                    nl: "Muiscursor klikken",
                    fr: "Clic du curseur de la souris",
                    it: "Clic del cursore del mouse",
                    es: "Clic del cursor del ratón",
                    pl: "Kliknięcie kursorem myszy",
                    uk: "Клацання курсором миші",
                    "zh-cn": "鼠标光标点击",
                },
                desc: "Create by Adapter",
                read: false,
                write: true,
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.cursor.click`, common, "state", false, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Pairing code",
                    de: "Kopplungscode",
                    ru: "Код сопряжения",
                    pt: "Código de emparelhamento",
                    nl: "Koppelingscode",
                    fr: "Code d'appariement",
                    it: "Codice di associazione",
                    es: "Código de emparejamiento",
                    pl: "Kod parowania",
                    uk: "Код сполучення",
                    "zh-cn": "配对码",
                },
                desc: "Create by Adapter",
                read: false,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.system.pair_code`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Mouse Cursor drag",
                    de: "Ziehen mit dem Mauszeiger",
                    ru: "Перетаскивание курсора мыши",
                    pt: "Arrastar o cursor do mouse",
                    nl: "Slepen met de muiscursor",
                    fr: "glisser le curseur de la souris",
                    it: "Trascinamento del cursore del mouse",
                    es: "Arrastre del cursor del ratón",
                    pl: "Przeciąganie kursora myszy",
                    uk: "Перетягування курсором миші",
                    "zh-cn": "鼠标光标拖动",
                },
                desc: "Create by Adapter",
                read: false,
                write: true,
                def: "1,1,drag",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.cursor.drag`, common, "state", "1,1,drag", null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Mouse Cursor scroll",
                    de: "Mauszeiger scrollen",
                    ru: "Прокрутка курсора мыши",
                    pt: "Rolagem do cursor do mouse",
                    nl: "Muiscursor scrollen",
                    fr: "Défilement du curseur de la souris",
                    it: "Scorrimento del cursore del mouse",
                    es: "Desplazamiento del cursor del ratón",
                    pl: "Przewijanie kursora myszy",
                    uk: "Прокручування курсором миші",
                    "zh-cn": "鼠标光标滚动",
                },
                desc: "Create by Adapter",
                read: false,
                write: true,
                def: "1,1",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.cursor.scroll`, common, "state", "1,1", null, null);
            common = {
                type: "boolean",
                role: "indicator.connected",
                name: {
                    en: "Status TV",
                    de: "Status TV",
                    ru: "Статус ТВ",
                    pt: "TV de status",
                    nl: "Status TV",
                    fr: "État TV",
                    it: "Stato TV",
                    es: "Status TV",
                    pl: "Status TV",
                    uk: "Статус на сервери",
                    "zh-cn": "地位电视",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.status.online`, common, "state", false, null, null);
            common = {
                type: "string",
                role: "json",
                name: {
                    en: "The responses from the first adapterstart",
                    de: "Die Antworten vom ersten Adapterstart",
                    ru: "Ответы от первого адаптера",
                    pt: "As respostas do primeiro adaptador começam",
                    nl: "De reacties van de eerste adapterstart",
                    fr: "Les réponses du premier adaptateur",
                    it: "Le risposte del primo adattatore iniziano",
                    es: "Las respuestas del primer adaptador comienzan",
                    pl: "Odpowiedzi z pierwszego adaptera startowego",
                    uk: "Відповіді від першого запуску адаптера",
                    "zh-cn": "来自第一个适配器的响应",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "[]",
            };
            await this.createDataPoint(`${this.dev.dp}.status.responseStart`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "json",
                name: {
                    en: "Possible settings",
                    de: "Mögliche Einstellungen",
                    ru: "Возможные настройки",
                    pt: "Configurações possíveis",
                    nl: "Mogelijke instellingen",
                    fr: "Paramètres possibles",
                    it: "Impostazioni possibili",
                    es: "Posibles configuraciones",
                    pl: "Możliwe ustawienia",
                    uk: "Можливі налаштування",
                    "zh-cn": "可能的设置",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "[]",
            };
            await this.createDataPoint(`${this.dev.dp}.status.possibleSettings`, common, "state", null, null, null);
            common = {
                role: "button",
                name: {
                    en: "Rewinding",
                    de: "Zurückspulen",
                    ru: "Перемотка",
                    pt: "Rebobinamento",
                    nl: "Veranderen",
                    fr: "Rewinding",
                    it: "Riavvolgimento",
                    es: "Rebobinado",
                    pl: "Odwrotnie",
                    uk: "Перемотування",
                    "zh-cn": "退税",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.rewind`, common, "state", false, null, null);
            common = {
                role: "button.fastforward",
                name: {
                    en: "Fast forwarding",
                    de: "Schneller Vorlauf",
                    ru: "Быстрое экспедирование",
                    pt: "Encaminhamento rápido",
                    nl: "Snel vooruit",
                    fr: "Avance rapide ",
                    it: "Avanti veloce",
                    es: "¡Un avance rápido",
                    pl: "Fast forwarding",
                    uk: "Швидка переадресація",
                    "zh-cn": "前进",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.fastForward`, common, "state", false, null, null);

            common = {
                role: "button",
                name: {
                    en: "exit",
                    de: "Ausgang",
                    ru: "выход",
                    pt: "saída",
                    nl: "vertaling:",
                    fr: "sortie",
                    it: "uscita",
                    es: "salida",
                    pl: "wyjście",
                    uk: "увійти",
                    "zh-cn": "撤离",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.exit`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Home",
                    de: "Home",
                    ru: "Начало",
                    pt: "Home",
                    nl: "Thuis",
                    fr: "Home",
                    it: "Home",
                    es: "Home",
                    pl: "Dom",
                    uk: "Головна",
                    "zh-cn": "家庭",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.home`, common, "state", false, null, null);
            common = {
                role: "button.volume.up",
                name: {
                    en: "Volume Up",
                    de: "Lautstärke nach oben",
                    ru: "Объем Up",
                    pt: "Volume para cima",
                    nl: "Volume Up",
                    fr: "Volume",
                    it: "Volume su",
                    es: "Volumen Up",
                    pl: "Volume Up",
                    uk: "Об'єм",
                    "zh-cn": "第一卷",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.volumeUp`, common, "state", false, null, null);
            common = {
                role: "button.volume.down",
                name: {
                    en: "Volume down",
                    de: "Lautstärke nach unten",
                    ru: "Объем вниз",
                    pt: "Volume para baixo",
                    nl: "Volume down",
                    fr: "Volume vers le bas",
                    it: "Volume down",
                    es: "Volumen baja",
                    pl: "Volumen down",
                    uk: "Об'єм",
                    "zh-cn": "量刑",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.volumeDown`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Red button",
                    de: "Roter Knopf",
                    ru: "Красная кнопка",
                    pt: "Botão vermelho",
                    nl: "Rode knop",
                    fr: "Bouton rouge",
                    it: "Pulsante rosso",
                    es: "Botón rojo",
                    pl: "Przycisk",
                    uk: "Червона кнопка",
                    "zh-cn": "D. 红十字会和红新月会",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.red`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Green button",
                    de: "Grüner Knopf",
                    ru: "Зеленая кнопка",
                    pt: "Botão verde",
                    nl: "Groene knop",
                    fr: "Bouton vert",
                    it: "Pulsante verde",
                    es: "Botón verde",
                    pl: "Green's button",
                    uk: "Зелена кнопка",
                    "zh-cn": "绿色顿",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.green`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Yellow button",
                    de: "Gelber Knopf",
                    ru: "Желтая кнопка",
                    pt: "Botão amarelo",
                    nl: "Gele knop",
                    fr: "Bouton jaune",
                    it: "Pulsante giallo",
                    es: "Botón amarillo",
                    pl: "Przycisk",
                    uk: "Жовта кнопка",
                    "zh-cn": "Yellow但ton",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.yellow`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Blue button",
                    de: "Blauer Knopf",
                    ru: "Голубая кнопка",
                    pt: "Botão azul",
                    nl: "Blauwe knop",
                    fr: "Bouton bleu",
                    it: "Pulsante blu",
                    es: "Botón azul",
                    pl: "Blue button",
                    uk: "Синя кнопка",
                    "zh-cn": "蓝图",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.blue`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 0",
                    de: "Taste 0",
                    ru: "Кнопка 0",
                    pt: "Botão 0",
                    nl: "Button 0",
                    fr: "Button 0",
                    it: "Pulsante 0",
                    es: "Botón 0",
                    pl: "Button 0",
                    uk: "Кнопка 0",
                    "zh-cn": "布顿",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit0`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 1",
                    de: "Taste 1",
                    ru: "Кнопка 1",
                    pt: "Botão 1",
                    nl: "Button 1",
                    fr: "Button 1",
                    it: "Pulsante 1",
                    es: "Botón 1",
                    pl: "Button 1",
                    uk: "Кнопка 1",
                    "zh-cn": "布顿1",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit1`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 2",
                    de: "Taste 2",
                    ru: "Кнопка 2",
                    pt: "Botão 2",
                    nl: "Button 2",
                    fr: "Button 2",
                    it: "Pulsante 2",
                    es: "Botón 2",
                    pl: "Button 2",
                    uk: "Кнопка 2",
                    "zh-cn": "布顿2",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit2`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 3",
                    de: "Taste 3",
                    ru: "Кнопка 3",
                    pt: "Botão 3",
                    nl: "Button 3",
                    fr: "Button 3",
                    it: "Pulsante 3",
                    es: "Botón 3",
                    pl: "Button 3",
                    uk: "Кнопка 3",
                    "zh-cn": "布顿3",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit3`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 4",
                    de: "Taste 4",
                    ru: "Кнопка 4",
                    pt: "Botão 4",
                    nl: "Button 4",
                    fr: "Button 4",
                    it: "Pulsante 4",
                    es: "Botón 4",
                    pl: "Button 4",
                    uk: "Кнопка 4",
                    "zh-cn": "布顿4",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit4`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 5",
                    de: "Taste 5",
                    ru: "Кнопка 5",
                    pt: "Botão 5",
                    nl: "Button 5",
                    fr: "Button 5",
                    it: "Pulsante 5",
                    es: "Button 5",
                    pl: "Button 5",
                    uk: "Кнопка 5",
                    "zh-cn": "布顿5",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit5`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 6",
                    de: "Taste 6",
                    ru: "Кнопка 6",
                    pt: "Botão 6",
                    nl: "Button 6",
                    fr: "Button 6",
                    it: "Pulsante 6",
                    es: "Botón 6",
                    pl: "Button 6",
                    uk: "Кнопка 6",
                    "zh-cn": "布顿6",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit6`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 7",
                    de: "Taste 7",
                    ru: "Кнопка 7",
                    pt: "Botão 7",
                    nl: "Button 7",
                    fr: "Button 7",
                    it: "Pulsante 7",
                    es: "Button 7",
                    pl: "Button 7",
                    uk: "Кнопка 7",
                    "zh-cn": "但第7条",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit7`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 8",
                    de: "Taste 8",
                    ru: "Кнопка 8",
                    pt: "Botão 8",
                    nl: "Button 8",
                    fr: "Button 8",
                    it: "Pulsante 8",
                    es: "Button 8",
                    pl: "Button 8",
                    uk: "Кнопка 8",
                    "zh-cn": "但第8条",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit8`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Button 9",
                    de: "Knopf 9",
                    ru: "Кнопка 9",
                    pt: "Botão 9",
                    nl: "Button 9",
                    fr: "Button 9",
                    it: "Pulsante 9",
                    es: "Botón 9",
                    pl: "Button 9",
                    uk: "Кнопка 9",
                    "zh-cn": "布顿9",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.digit9`, common, "state", false, null, null);
            common = {
                type: "boolean",
                role: "switch",
                name: {
                    en: "mute",
                    de: "stumm",
                    ru: "милый",
                    pt: "muda",
                    nl: "mute",
                    fr: "mute",
                    it: "mute",
                    es: "mute",
                    pl: "bunt",
                    uk: "мапа",
                    "zh-cn": "穆特",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.mute`, common, "state", false, null, null);
            common = {
                type: "boolean",
                role: "button",
                name: {
                    en: "Sends a delete key press",
                    de: "Sendet einen Tastendruck der Entf-Taste",
                    ru: "Отправляет нажатие клавиши Delete.",
                    pt: "Envia um pressionamento da tecla Delete.",
                    nl: "Verzendt een druk op de delete-toets.",
                    fr: "Envoie une pression sur la touche Suppr.",
                    it: "Invia una pressione del tasto Elimina",
                    es: "Envía una pulsación de tecla eliminar",
                    pl: "Wysyła naciśnięcie klawisza Delete",
                    uk: "Надсилає натискання клавіші видалення",
                    "zh-cn": "发送删除键按下",
                },
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.deleteText`, common, "state", false, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Inserts text into the currently focused input field",
                    de: "Fügt Text in das aktuell fokussierte Eingabefeld ein.",
                    ru: "Вставляет текст в текущее поле ввода, находящееся в фокусе.",
                    pt: "Insere texto no campo de entrada atualmente selecionado.",
                    nl: "Voegt tekst in het momenteel geselecteerde invoerveld in.",
                    fr: "Insère du texte dans le champ de saisie actuellement sélectionné.",
                    it: "Inserisce il testo nel campo di input attualmente attivo",
                    es: "Inserta texto en el campo de entrada enfocado actualmente",
                    pl: "Wstawia tekst do aktualnie wybranego pola wprowadzania danych",
                    uk: "Вставляє текст у поточне поле введення, на якому знаходиться фокус",
                    "zh-cn": "将文本插入到当前聚焦的输入字段中",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.insertText`, common, "state", "", null, null);
            common = {
                type: "boolean",
                role: "switch",
                name: {
                    en: "MDN Log enabled/disabled",
                    de: "MDN-Protokoll aktiviert/deaktiviert",
                    ru: "Журнал MDN включен/отключен",
                    pt: "Registro MDN ativado/desativado",
                    nl: "MDN-logboek in-/uitgeschakeld",
                    fr: "Journal MDN activé/désactivé",
                    it: "Registro MDN abilitato/disabilitato",
                    es: "Registro MDN habilitado/deshabilitado",
                    pl: "Włączono/wyłączono dziennik MDN",
                    uk: "Журнал MDN увімкнено/вимкнено",
                    "zh-cn": "MDN日志已启用/已禁用",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.mdnLog`, common, "state", false, null, null);
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "TV Channel",
                    de: "Fernsehkanal",
                    ru: "Телеканал",
                    pt: "Canal de TV",
                    nl: "Tv-kanaal",
                    fr: "Chaîne de télévision",
                    it: "Canale televisivo",
                    es: "Canal de televisión",
                    pl: "Kanał telewizyjny",
                    uk: "Телеканал",
                    "zh-cn": "电视台",
                },
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: 0,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.channel`, common, "state", 0, null, null);
            common = {
                role: "button",
                name: {
                    en: "Closes the app launcher",
                    de: "Schließt den App-Launcher",
                    ru: "Закрывает панель запуска приложений",
                    pt: "Fecha o iniciador de aplicativos.",
                    nl: "Sluit de app-launcher.",
                    fr: "Ferme le lanceur d'applications",
                    it: "Chiude l'app launcher",
                    es: "Cierra el iniciador de aplicaciones.",
                    pl: "Zamyka program uruchamiający aplikacje",
                    uk: "Закриває панель запуску програм",
                    "zh-cn": "关闭应用启动器",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.closeLaunch`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Takes a screenshot of the current TV display",
                    de: "Erstellt einen Screenshot des aktuellen Fernsehbildschirms.",
                    ru: "Делает снимок экрана текущего телевизора.",
                    pt: "Captura uma imagem da tela atual da TV.",
                    nl: "Maakt een schermafbeelding van het huidige tv-scherm.",
                    fr: "Prend une capture d'écran de l'écran de télévision actuel.",
                    it: "Esegue uno screenshot dello schermo TV corrente",
                    es: "Toma una captura de pantalla de la pantalla del televisor actual.",
                    pl: "Wykonuje zrzut ekranu bieżącego ekranu telewizora",
                    uk: "Робить знімок екрана поточного екрана телевізора",
                    "zh-cn": "截取当前电视屏幕的屏幕截图",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.screenshot`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Closes a web application running",
                    de: "Schließt eine laufende Webanwendung",
                    ru: "Закрывает работающее веб-приложение",
                    pt: "Fecha um aplicativo web em execução.",
                    nl: "Sluit een webapplicatie die actief is.",
                    fr: "Ferme une application web en cours d'exécution",
                    it: "Chiude un'applicazione web in esecuzione",
                    es: "Cierra una aplicación web en ejecución",
                    pl: "Zamyka działającą aplikację internetową",
                    uk: "Закриває запущену веб-програму",
                    "zh-cn": "关闭正在运行的 Web 应用程序",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.closeWebApp`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Activates the screensaver",
                    de: "Aktiviert den Bildschirmschoner",
                    ru: "Активирует заставку",
                    pt: "Ativa o protetor de tela",
                    nl: "Activeert de schermbeveiliging",
                    fr: "Active l'économiseur d'écran",
                    it: "Attiva lo screensaver",
                    es: "Activa el protector de pantalla",
                    pl: "Aktywuje wygaszacz ekranu",
                    uk: "Активує заставку",
                    "zh-cn": "启用屏幕保护程序",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.screenSaver`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Activates the screensaver",
                    de: "Aktiviert den Bildschirmschoner",
                    ru: "Активирует заставку",
                    pt: "Ativa o protetor de tela",
                    nl: "Activeert de schermbeveiliging",
                    fr: "Active l'économiseur d'écran",
                    it: "Attiva lo screensaver",
                    es: "Activa el protector de pantalla",
                    pl: "Aktywuje wygaszacz ekranu",
                    uk: "Активує заставку",
                    "zh-cn": "启用屏幕保护程序",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.keys.showInputPicker`,
                common,
                "state",
                false,
                null,
                null,
            );
            common = {
                role: "button.start",
                name: {
                    en: "Play",
                    de: "Abspielen",
                    ru: "Играть",
                    pt: "Jogar",
                    nl: "Toneelstuk",
                    fr: "Jouer",
                    it: "Giocare",
                    es: "Jugar",
                    pl: "Grać",
                    uk: "Грати",
                    "zh-cn": "玩",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.play`, common, "state", false, null, null);
            common = {
                role: "button.pause",
                name: {
                    en: "Pause",
                    de: "Pause",
                    ru: "Пауза",
                    pt: "Pausa",
                    nl: "Pauze",
                    fr: "Pause",
                    it: "Pausa",
                    es: "Pausa",
                    pl: "Pauza",
                    uk: "Пауза",
                    "zh-cn": "暂停",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.pause`, common, "state", false, null, null);
            common = {
                role: "button.stop",
                name: {
                    en: "Stop",
                    de: "Stopp",
                    ru: "Стоп",
                    pt: "Pára",
                    nl: "Stop",
                    fr: "Arrête",
                    it: "Fermati",
                    es: "Para",
                    pl: "Stop",
                    uk: "Зареєструватися",
                    "zh-cn": "禁止",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.stop`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Channel Step Down",
                    de: "Kanal nach unten",
                    ru: "Канал Шаг Вниз",
                    pt: "Passo do canal para baixo",
                    nl: "Channel Step Down",
                    fr: "Channel Step Down",
                    it: "Canale passo giù",
                    es: "Canales abajo",
                    pl: "Channel Step Down",
                    uk: "Канал Крок вниз",
                    "zh-cn": "Channel Step Down",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.channelDown`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Channel Step Up",
                    de: "Kanal nach oben",
                    ru: "Канал Step Up",
                    pt: "Passo do canal para cima",
                    nl: "Kanaal Step Up",
                    fr: "Channel Step Up",
                    it: "Canale passo su",
                    es: "Canales arriba",
                    pl: "Channel Step Up",
                    uk: "Канал Крок вгору",
                    "zh-cn": "海峡步骤",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.channelUp`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "return",
                    de: "zurück",
                    ru: "вернуться",
                    pt: "retorno",
                    nl: "terug",
                    fr: "retour",
                    it: "ritorno",
                    es: "retorno",
                    pl: "wracać",
                    uk: "увійти",
                    "zh-cn": "返回",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.back`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "TV Off",
                    de: "Fernseher aus",
                    ru: "Телевизор выключен",
                    pt: "TV desligada",
                    nl: "Tv uit",
                    fr: "Télévision éteinte",
                    it: "TV spenta",
                    es: "TV apagada",
                    pl: "Wyłączony telewizor",
                    uk: "Вимкнено телевізор",
                    "zh-cn": "电视关机",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.powerOff`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "TV On",
                    de: "Fernsehen an",
                    ru: "ТВ включен",
                    pt: "TV Ligada",
                    nl: "TV aan",
                    fr: "Télévision allumée",
                    it: "TV accesa",
                    es: "Televisión encendida",
                    pl: "Telewizor włączony",
                    uk: "Телевізор увімкнено",
                    "zh-cn": "电视",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.powerOn`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Screen On",
                    de: "Bildschirm an",
                    ru: "Экран включен",
                    pt: "Tela ligada",
                    nl: "Scherm aan",
                    fr: "Écran allumé",
                    it: "Schermo acceso",
                    es: "Pantalla encendida",
                    pl: "Ekran włączony",
                    uk: "Екран увімкнено",
                    "zh-cn": "屏幕开启",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.screenOn`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Screen Off",
                    de: "Bildschirm aus",
                    ru: "Экран выключен",
                    pt: "Tela desligada",
                    nl: "Scherm uit",
                    fr: "Écran éteint",
                    it: "Schermo spento",
                    es: "Pantalla apagada",
                    pl: "Zastawiać parawanem",
                    uk: "Вимкнення екрана",
                    "zh-cn": "屏幕关闭",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.screenOff`, common, "state", false, null, null);
            common = {
                role: "state",
                name: {
                    en: "Create notification",
                    de: "Benachrichtigung erstellen",
                    ru: "Создать уведомление",
                    pt: "Criar notificação",
                    nl: "Maak een melding aan",
                    fr: "Créer une notification",
                    it: "Crea notifica",
                    es: "Crear notificación",
                    pl: "Utwórz powiadomienie",
                    uk: "Створити сповіщення",
                    "zh-cn": "创建通知",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.notify.createToast`, common, "state", "", null, null);
            common = {
                role: "state",
                name: {
                    en: "Close notification",
                    de: "Benachrichtigung schließen",
                    ru: "Закрыть уведомление",
                    pt: "Fechar notificação",
                    nl: "Melding sluiten",
                    fr: "Fermer la notification",
                    it: "Chiudi notifica",
                    es: "Cerrar notificación",
                    pl: "Zamknij powiadomienie",
                    uk: "Закрити сповіщення",
                    "zh-cn": "关闭通知",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: "",
                states: { no: "no toast id" },
            };
            await this.createDataPoint(`${this.dev.dp}.remote.notify.closeToast`, common, "state", "no", null, null);
            common = {
                role: "state",
                name: {
                    en: "Create alert message",
                    de: "Warnmeldung erstellen",
                    ru: "Создать сообщение-оповещение",
                    pt: "Criar mensagem de alerta",
                    nl: "Maak een waarschuwingsbericht aan",
                    fr: "Créer un message d'alerte",
                    it: "Crea messaggio di avviso",
                    es: "Crear mensaje de alerta",
                    pl: "Utwórz wiadomość alertu",
                    uk: "Створити сповіщення",
                    "zh-cn": "创建提醒消息",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.notify.createAlert`, common, "state", "", null, null);
            common = {
                role: "state",
                name: {
                    en: "Alert message close",
                    de: "Warnmeldung schließen",
                    ru: "Сообщение об ошибке закрыто",
                    pt: "Fechar mensagem de alerta",
                    nl: "Waarschuwingsbericht sluiten",
                    fr: "Fermer le message d'alerte",
                    it: "Messaggio di avviso chiuso",
                    es: "Mensaje de alerta cerrado",
                    pl: "Komunikat ostrzegawczy zamknięty",
                    uk: "Закрити сповіщення",
                    "zh-cn": "关闭警报消息",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: "",
                states: { no: "no alert id" },
            };
            await this.createDataPoint(`${this.dev.dp}.remote.notify.closeAlert`, common, "state", "no", null, null);
            common = {
                role: "json",
                name: {
                    en: "Own request",
                    de: "Eigene Anfrage",
                    ru: "Собственный запрос",
                    pt: "A pedido próprio",
                    nl: "Eigen verzoek",
                    fr: "Demande personnelle",
                    it: "Richiesta personale",
                    es: "Solicitud propia",
                    pl: "Własne żądanie",
                    uk: "Власний запит",
                    "zh-cn": "本人请求",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: JSON.stringify({
                    type: "request",
                    uri: "com.webos.service.ime/sendEnterKey",
                    payload: { name: "1" },
                    prefix: "ssap://",
                }),
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.own_request.request`,
                common,
                "state",
                JSON.stringify({
                    type: "request",
                    uri: "com.webos.service.ime/sendEnterKey",
                    payload: { name: "1" },
                    prefix: "ssap://",
                }),
                null,
                null,
            );
            common = {
                role: "json",
                name: {
                    en: "Response",
                    de: "Antwort",
                    ru: "Ответ",
                    pt: "Resposta",
                    nl: "Antwoord",
                    fr: "Réponse",
                    it: "Risposta",
                    es: "Respuesta",
                    pl: "Odpowiedź",
                    uk: "Відповідь",
                    "zh-cn": "回复",
                },
                type: "string",
                read: true,
                write: true,
                desc: "Create by Adapter",
                def: JSON.stringify({}),
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.own_request.response`,
                common,
                "state",
                JSON.stringify({}),
                null,
                null,
            );
            common = {
                role: "json",
                name: {
                    en: "Response from subscribed",
                    de: "Antwort von Abonnenten",
                    ru: "Ответ от подписчиков",
                    pt: "Resposta do assinante",
                    nl: "Reactie van abonnees",
                    fr: "Réponse des abonnés",
                    it: "Risposta da iscritto",
                    es: "Respuesta del suscrito",
                    pl: "Odpowiedź od subskrybenta",
                    uk: "Відповідь від підписаного користувача",
                    "zh-cn": "订阅者的回复",
                },
                type: "string",
                read: true,
                write: false,
                desc: "Create by Adapter",
                def: JSON.stringify({}),
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.own_request.responseSubscribe`,
                common,
                "state",
                JSON.stringify({}),
                null,
                null,
            );
            common = {
                role: "button",
                name: {
                    en: "LG Menu",
                    de: "LG-Menü",
                    ru: "Меню LG",
                    pt: "Menu LG",
                    nl: "LG-menu",
                    fr: "Menu LG",
                    it: "Menù LG",
                    es: "Menú LG",
                    pl: "Menu LG",
                    uk: "Меню LG",
                    "zh-cn": "LG菜单",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.menu`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Enter",
                    de: "Eingeben",
                    ru: "Входить",
                    pt: "Digitar",
                    nl: "Binnenkomen",
                    fr: "Entrer",
                    it: "Entra",
                    es: "Ingresar",
                    pl: "Wchodzić",
                    uk: "Введіть",
                    "zh-cn": "进入",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.enter`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Up",
                    de: "Hoch",
                    ru: "Вверх",
                    pt: "Acima",
                    nl: "Omhoog",
                    fr: "En haut",
                    it: "Su",
                    es: "Arriba",
                    pl: "W górę",
                    uk: "Вгору",
                    "zh-cn": "向上",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.up`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Left",
                    de: "Links",
                    ru: "Левый",
                    pt: "Esquerda",
                    nl: "Links",
                    fr: "Gauche",
                    it: "Sinistra",
                    es: "Izquierda",
                    pl: "Lewy",
                    uk: "Ліворуч",
                    "zh-cn": "左边",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.left`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Right",
                    de: "Rechts",
                    ru: "Верно",
                    pt: "Certo",
                    nl: "Rechts",
                    fr: "Droite",
                    it: "Giusto",
                    es: "Bien",
                    pl: "Prawidłowy",
                    uk: "Праворуч",
                    "zh-cn": "正确的",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.right`, common, "state", false, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Open URL in TV Browser",
                    de: "URL im TV-Browser öffnen",
                    ru: "Открыть URL в браузере ТВ",
                    pt: "Abrir URL no navegador da TV",
                    nl: "Open URL in tv-browser",
                    fr: "Ouvrir l'URL dans le navigateur TV",
                    it: "Apri URL nel browser TV",
                    es: "Abrir URL en el navegador del televisor",
                    pl: "Otwórz adres URL w przeglądarce telewizyjnej",
                    uk: "Відкрити URL-адресу в браузері телевізора",
                    "zh-cn": "在电视浏览器中打开网址",
                },
                desc: "Create by Adapter",
                read: true,
                write: true,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.openURL`, common, "state", "", null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Channel Id",
                    de: "Kanal-ID",
                    ru: "Идентификатор канала",
                    pt: "ID do canal",
                    nl: "Kanaal-ID",
                    fr: "ID du canal",
                    it: "ID canale",
                    es: "Identificación del canal",
                    pl: "Identyfikator kanału",
                    uk: "Ідентифікатор каналу",
                    "zh-cn": "通道 ID",
                },
                desc: "Create by Adapter",
                read: true,
                write: true,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.channelId`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Channel Type",
                    de: "Kanaltyp",
                    ru: "Тип канала",
                    pt: "Tipo de canal",
                    nl: "Kanaaltype",
                    fr: "Type de canal",
                    it: "Tipo di canale",
                    es: "Tipo de canal",
                    pl: "Typ kanału",
                    uk: "Тип каналу",
                    "zh-cn": "通道类型",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.channelType`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Channel Name",
                    de: "Kanalname",
                    ru: "Название канала",
                    pt: "Nome do canal",
                    nl: "Kanaalnaam",
                    fr: "Nom de la chaîne",
                    it: "Nome del canale",
                    es: "Nombre del canal",
                    pl: "Nazwa kanału",
                    uk: "Назва каналу",
                    "zh-cn": "频道名称",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.channelName`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Channel Model",
                    de: "Kanalmodell",
                    ru: "Модель канала",
                    pt: "Modelo de canal",
                    nl: "Kanaalmodel",
                    fr: "Modèle de canal",
                    it: "Modello di canale",
                    es: "Modelo de canal",
                    pl: "Model kanału",
                    uk: "Модель каналу",
                    "zh-cn": "渠道模型",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.channelModel`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Program ID",
                    de: "Programm-ID",
                    ru: "Идентификатор программы",
                    pt: "ID do programa",
                    nl: "Programma-ID",
                    fr: "ID du programme",
                    it: "ID programma",
                    es: "Identificación del programa",
                    pl: "Identyfikator programu",
                    uk: "Ідентифікатор програми",
                    "zh-cn": "程序 ID",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.programId`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Program Name",
                    de: "Programmname",
                    ru: "Название программы",
                    pt: "Nome do programa",
                    nl: "Programmanaam",
                    fr: "Nom du programme",
                    it: "Nome del programma",
                    es: "Nombre del programa",
                    pl: "Nazwa programu",
                    uk: "Назва програми",
                    "zh-cn": "程序名称",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.programName`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Program Description",
                    de: "Programmbeschreibung",
                    ru: "Описание программы",
                    pt: "Descrição do programa",
                    nl: "Programmaomschrijving",
                    fr: "Description du programme",
                    it: "Descrizione del programma",
                    es: "Descripción del programa",
                    pl: "Opis programu",
                    uk: "Опис програми",
                    "zh-cn": "项目描述",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.programDesc`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "date.start",
                name: {
                    en: "Program Start",
                    de: "Programmstart",
                    ru: "Начало программы",
                    pt: "Início do programa",
                    nl: "Programma start",
                    fr: "Début du programme",
                    it: "Avvio del programma",
                    es: "Inicio del programa",
                    pl: "Rozpoczęcie programu",
                    uk: "Запуск програми",
                    "zh-cn": "节目开始",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.programStart`, common, "state", null, null, null);
            common = {
                type: "string",
                role: "date.end",
                name: {
                    en: "Program End",
                    de: "Programmende",
                    ru: "Программа завершена",
                    pt: "Fim do programa",
                    nl: "Programma-einde",
                    fr: "Fin du programme",
                    it: "Fine del programma",
                    es: "Fin del programa",
                    pl: "Koniec programu",
                    uk: "Кінець програми",
                    "zh-cn": "节目结束",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${this.dev.dp}.remote.states.programEnd`, common, "state", null, null, null);
            common = {
                type: "number",
                role: "time.span",
                name: {
                    en: "Program Duration",
                    de: "Programmdauer",
                    ru: "Продолжительность программы",
                    pt: "Duração do programa",
                    nl: "Programmaduur",
                    fr: "Durée du programme",
                    it: "Durata del programma",
                    es: "Duración del programa",
                    pl: "Czas trwania programu",
                    uk: "Тривалість програми",
                    "zh-cn": "节目时长",
                },
                desc: "Create by Adapter",
                read: true,
                write: false,
                unit: "sec",
                def: 0,
            };
            await this.createDataPoint(
                `${this.dev.dp}.remote.states.programDuration`,
                common,
                "state",
                null,
                null,
                null,
            );
            common = {
                role: "button",
                name: {
                    en: "Down",
                    de: "Runter",
                    ru: "Вниз",
                    pt: "Abaixo",
                    nl: "Omlaag",
                    fr: "Vers le bas",
                    it: "Giù",
                    es: "Abajo",
                    pl: "W dół",
                    uk: "Вниз",
                    "zh-cn": "向下",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.down`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "Closed captioning",
                    de: "Untertitelung",
                    ru: "Субтитры",
                    pt: "Legendas ocultas",
                    nl: "Ondertiteling",
                    fr: "Sous-titrage codé",
                    it: "Sottotitoli",
                    es: "subtítulos cerrados",
                    pl: "Napisy dla niesłyszących",
                    uk: "Субтитри",
                    "zh-cn": "隐藏式字幕",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.cc`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: 'Literally just an "*"',
                    de: 'Einfach nur ein "*"',
                    ru: 'Буквально просто "*"',
                    pt: 'Literalmente apenas um "*"',
                    nl: 'Letterlijk gewoon een "*"',
                    fr: 'Littéralement juste un "*"',
                    it: 'Letteralmente solo un "*"',
                    es: 'Literalmente sólo un "*"',
                    pl: 'Dosłownie tylko "*"',
                    uk: 'Буквально просто "*"',
                    "zh-cn": "就只是一个“*”",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
            };
            await this.createDataPoint(`${this.dev.dp}.remote.keys.asterisk`, common, "state", false, null, null);
            common = {
                role: "button",
                name: {
                    en: "The right side menu that appears with Live button",
                    de: "Das rechte Seitenmenü, das mit der Schaltfläche „Live“ erscheint.",
                    ru: "Меню справа, которое появляется рядом с кнопкой Live.",
                    pt: "O menu lateral direito que aparece com o botão Ao Vivo",
                    nl: "Het menu aan de rechterkant dat verschijnt met de Live-knop.",
                    fr: "Le menu latéral droit qui apparaît avec le bouton Live",
                    it: "Il menu sul lato destro che appare con il pulsante Live",
                    es: "El menú del lado derecho que aparece con el botón En vivo",
                    pl: "Menu po prawej stronie, które pojawia się z przyciskiem Na żywo",
                    uk: "Праве бічне меню, яке відображається з кнопкою «Наживо»",
                    "zh-cn": "右侧菜单栏中会显示“直播”按钮",
                },
                type: "boolean",
                read: false,
                write: true,
                desc: "Create by Adapter",
                def: false,
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
    private async createDataPoint(
        ident: string,
        common: any,
        types: "state" | "folder" | "channel" | "device",
        value: string | number | boolean | null | undefined,
        extend: boolean | null | undefined,
        native = null,
    ): Promise<void> {
        try {
            const nativvalue: any = !native ? { native: {} } : { native: native };
            const obj: any = await this.adapter.getObjectAsync(ident);
            if (!obj) {
                await this.adapter
                    .setObjectNotExistsAsync(ident, {
                        type: types,
                        common: common,
                        ...nativvalue,
                    })
                    .catch(error => {
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
                        common: common,
                        ...nativvalue,
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
        } catch (error: unknown) {
            if (typeof error === "string") {
                this.adapter.log.error(`createDataPoint: ${error}`);
            } else if (error instanceof Error) {
                this.adapter.log.error(`createDataPoint: ${error.name}: ${error.message}`);
            }
        }
    }
}
