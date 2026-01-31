/* eslint-disable no-var */
/* eslint-disable no-undef */
// @ts-nocheck
"use strict";

if (typeof goog !== "undefined") {
    goog.provide("Blockly.JavaScript.Sendto");
    goog.require("Blockly.JavaScript");
}

Blockly.Translate =
    Blockly.Translate ||
    function (word, lang) {
        lang = lang || systemLang;
        if (Blockly.Words && Blockly.Words[word]) {
            return Blockly.Words[word][lang] || Blockly.Words[word].en;
        } else {
            return word;
        }
    };

/// --- SendTo lg-webos --------------------------------------------------
Blockly.Words["no_instance_found"] = {
    en: "No instance found",
    de: "Keine Instanz gefunden",
    ru: "Не найден",
    pt: "Nenhuma instância encontrada",
    nl: "Geen instantie gevonden",
    fr: "Aucune instance trouvée",
    it: "Nessun caso trovato",
    es: "No hay caso encontrado",
    pl: "Brak",
    uk: "Не знайдено",
    "zh-cn": "未找到实例",
};
Blockly.Words["lg_webos"] = {
    en: "LG-WebOS",
    de: "LG-WebOS",
    ru: "LG-WebOS",
    pt: "LG-WebOS",
    nl: "LG-WebOS",
    fr: "LG-WebOS",
    it: "LG-WebOS",
    es: "LG-WebOS",
    pl: "LG-WebOS",
    uk: "LG-WebOS",
    "zh-cn": "LG-WebOS",
};
Blockly.Words["lg_webos_tooltip"] = {
    en: "Own request send",
    de: "Eigene Anfrage senden",
    ru: "Отправить собственный запрос",
    pt: "Enviar solicitação própria",
    nl: "Eigen verzoek verzenden",
    fr: "Envoyer ma propre demande",
    it: "Invia richiesta personale",
    es: "Enviar solicitud propia",
    pl: "Własne żądanie wyślij",
    uk: "Надіслати власний запит",
    "zh-cn": "发送自己的请求",
};
Blockly.Words["lg_webos_all"] = {
    en: "All",
    de: "Alle",
    ru: "Все",
    pt: "Todos",
    nl: "Allen",
    fr: "Tout",
    it: "Tutti",
    es: "Todos",
    pl: "Cały",
    uk: "Всі",
    "zh-cn": "一. 导言",
};
Blockly.Words["lg_webos_prefix"] = {
    en: "Prefix",
    de: "Präfix",
    ru: "Префикс",
    pt: "Prefixo",
    nl: "Voorvoegsel",
    fr: "Préfixe",
    it: "Prefisso",
    es: "Prefijo",
    pl: "Prefiks",
    uk: "Префікс",
    "zh-cn": "前缀",
};
Blockly.Words["lg_webos_payload"] = {
    en: "Payload",
    de: "Nutzerdaten",
    ru: "Полезная нагрузка",
    pt: "Carga útil",
    nl: "Payload",
    fr: "Charge utile",
    it: "Carico utile",
    es: "Carga útil",
    pl: "Ładunek",
    uk: "Корисне навантаження",
    "zh-cn": "有效载荷",
};
Blockly.Words["lg_webos_help"] = {
    en: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    de: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    ru: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    pt: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    nl: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    fr: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    it: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    es: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    pl: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    uk: "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
    "zh-cn": "https://github.com/Lucky-ESA/ioBroker.lg-webos/blob/master/README.md",
};
Blockly.Words["lg_webos_with_results"] = {
    en: "with result",
    de: "mit Ergebnis",
    ru: "с результатом",
    pt: "com resultado",
    nl: "met resultaat",
    fr: "avec résultat",
    it: "con risultato",
    es: "con resultado",
    pl: "wynik",
    uk: "з результатом",
    "zh-cn": "结果",
};
Blockly.Words["lg_webos_uri"] = {
    en: "URI",
    de: "URI",
    ru: "URI",
    pt: "URI",
    nl: "URI",
    fr: "URI",
    it: "URI",
    es: "URI",
    pl: "URI",
    uk: "URI",
    "zh-cn": "URI",
};
Blockly.Words["lg_webos_type"] = {
    en: "Type",
    de: "Typ",
    ru: "Тип",
    pt: "Tipo",
    nl: "Type",
    fr: "Taper",
    it: "Tipo",
    es: "Tipo",
    pl: "Typ",
    uk: "Тип",
    "zh-cn": "类型",
};
Blockly.Words["lg_webos_select"] = {
    en: "TV select",
    de: "TV-Auswahl",
    ru: "Выбор ТВ",
    pt: "Seleção de TV",
    nl: "Tv-selectie",
    fr: "Sélection TV",
    it: "Selezione TV",
    es: "Selección de TV",
    pl: "Wybór telewizora",
    uk: "Вибір телевізора",
    "zh-cn": "电视选择",
};
Blockly.Sendto.blocks["lg_webos"] =
    '<sep gap="5"></sep>' +
    '<block type="lg_webos">' +
    '     <field name="INSTANCE"></field>' +
    '     <field name="TVNAME"></field>' +
    '     <value name="TYPE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">request</field>' +
    "         </shadow>" +
    "     </value>" +
    '     <value name="URI">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">system.notifications/createToast</field>' +
    "         </shadow>" +
    "     </value>" +
    '     <value name="PAYLOAD">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">{ "message": "Test Message" }</field>' +
    "         </shadow>" +
    "     </value>" +
    '     <value name="PREFIX">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">ssap://</field>' +
    "         </shadow>" +
    "     </value>" +
    '     <field name="WITH_STATEMENT">FALSE</field>' +
    "</block>";

Blockly.Blocks["lg_webos"] = {
    init: function () {
        const options_user = [];
        const options_instance = [];

        options_user.push([Blockly.Translate("lg_webos_all"), "all"]);

        if (typeof main !== "undefined" && main.instances) {
            for (let i = 0; i < main.instances.length; i++) {
                const m = main.instances[i].match(/^system.adapter.lg-webos.(\d+)$/);
                if (m) {
                    const n = parseInt(m[1], 10);
                    options_instance.push(["lg-webos." + n, "." + n]);
                    if (main.objects[main.instances[i]].native.devices) {
                        for (let a = 0; a < main.objects[main.instances[i]].native.devices.length; a++) {
                            const id = main.objects[main.instances[i]].native.devices[a].ip;
                            options_user.push([n + "." + id, id]);
                        }
                    }
                }
            }
        }
        if (Object.keys(options_instance).length == 0)
            options_instance.push([Blockly.Translate("no_instance_found"), ""]);

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("lg_webos"))
            .appendField(new Blockly.FieldDropdown(options_instance), "INSTANCE");

        this.appendDummyInput("TVNAME")
            .appendField(Blockly.Translate("lg_webos_select"))
            .appendField(new Blockly.FieldDropdown(options_user), "TVNAME");

        this.appendValueInput("TYPE").appendField(Blockly.Translate("lg_webos_type"));
        this.appendValueInput("URI").appendField(Blockly.Translate("lg_webos_uri"));
        this.appendValueInput("PAYLOAD").appendField(Blockly.Translate("lg_webos_payload"));
        this.appendValueInput("PREFIX").appendField(Blockly.Translate("lg_webos_prefix"));

        this.appendDummyInput("WITH_STATEMENT")
            .appendField(Blockly.Translate("lg_webos_with_results"))
            .appendField(
                new Blockly.FieldCheckbox("FALSE", function (option) {
                    const withStatement = option === true || option === "true" || option === "TRUE";
                    this.sourceBlock_.updateShape_(withStatement);
                }),
                "WITH_STATEMENT",
            );

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);

        this.setTooltip(Blockly.Translate("lg_webos_tooltip"));
        this.setHelpUrl(Blockly.Translate("lg_webos_help"));
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function (withStatement) {
        const workspace = this.workspace;

        // Add new inputs.
        for (let i = 0; i < this.itemCount_; i++) {
            let input = this.getInput("ARG" + i);

            if (!input) {
                input = this.appendValueInput("ARG" + i).setAlign(Blockly.ALIGN_RIGHT);
                input.appendField(this.attributes_[i]);
            } else if (input.fieldRow.length >= 1) {
                input.fieldRow[0].setValue(this.attributes_[i]);
            }

            setTimeout(
                __input => {
                    if (!__input.connection.isConnected()) {
                        const _shadow = workspace.newBlock("text");
                        _shadow.setShadow(true);
                        _shadow.initSvg();
                        _shadow.render();
                        _shadow.outputConnection.connect(__input.connection);
                    }
                },
                100,
                input,
            );
        }
        // Remove deleted inputs.
        for (let i = this.itemCount_; this.getInput("ARG" + i); i++) {
            this.removeInput("ARG" + i);
        }

        if (withStatement === undefined) {
            withStatement = this.getFieldValue("WITH_STATEMENT");
            withStatement = withStatement === true || withStatement === "true" || withStatement === "TRUE";
        }

        this.getInput("STATEMENT") && this.removeInput("STATEMENT");

        // Add or remove a statement Input.
        if (withStatement) {
            this.appendStatementInput("STATEMENT");
        }
    },
};

Blockly.JavaScript["lg_webos"] = function (block) {
    const dropdown_instance = block.getFieldValue("INSTANCE");
    const value_name = block.getFieldValue("TVNAME");
    const value_type = Blockly.JavaScript.valueToCode(block, "TYPE", Blockly.JavaScript.ORDER_ATOMIC);
    const value_uri = Blockly.JavaScript.valueToCode(block, "URI", Blockly.JavaScript.ORDER_ATOMIC);
    const value_payload = Blockly.JavaScript.valueToCode(block, "PAYLOAD", Blockly.JavaScript.ORDER_ATOMIC);
    const value_prefix = Blockly.JavaScript.valueToCode(block, "PREFIX", Blockly.JavaScript.ORDER_ATOMIC);
    const fWithStatement = block.getFieldValue("WITH_STATEMENT");
    let statement;
    if (fWithStatement === true || fWithStatement === "true" || fWithStatement === "TRUE") {
        statement = Blockly.JavaScript.statementToCode(block, "STATEMENT");
    }

    let para_value_payload = null;
    if (value_payload != null && value_payload != "") {
        if (value_payload.startsWith("{")) {
            para_value_payload = `JSON.parse(${value_payload})`;
        } else if (typeof value_payload === "object") {
            para_value_payload = `JSON.parse(${JSON.stringify(value_payload)})`;
        } else {
            para_value_payload = `JSON.parse(${value_payload})`;
        }
    }

    if (statement) {
        return (
            `sendTo('lg-webos${dropdown_instance}', 'sendData', {\n` +
            `  name: '${value_name}',\n` +
            `  type: ${value_type},\n` +
            `  uri: ${value_uri},\n` +
            `  payload: ${para_value_payload},\n` +
            `  prefix: ${value_prefix},\n` +
            `}, async (result) => {\n` +
            statement +
            `});`
        );
    }
    return (
        `sendTo('lg-webos${dropdown_instance}', 'sendData', {\n` +
        `  name: '${value_name}',\n` +
        `  type: ${value_type},\n` +
        `  uri: ${value_uri},\n` +
        `  payload: ${para_value_payload},\n` +
        `  prefix: ${value_prefix},\n` +
        `});`
    );
};
