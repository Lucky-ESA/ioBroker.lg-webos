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
var request_exports = {};
__export(request_exports, {
  axoisRrequest: () => axoisRrequest
});
module.exports = __toCommonJS(request_exports);
var import_axios = __toESM(require("axios"));
var https = __toESM(require("node:https"));
class axoisRrequest {
  requestClient;
  /**
   * Axios Handler
   */
  constructor() {
    this.requestClient = import_axios.default.create({
      timeout: 1e4,
      withCredentials: true,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Content-Type": "image/png",
        "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0"
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
  }
  /**
   * @param url Icon URL
   * @returns axios response
   */
  async get(url) {
    return await this.requestClient({
      method: "GET",
      url,
      responseType: "arraybuffer"
    }).then((res) => {
      return res;
    }).catch((err) => {
      let error = "";
      if (err instanceof import_axios.AxiosError) {
        error = err.response ? err.response.data : "Server Unavailable";
      } else if (err instanceof Error) {
        error = err.message;
      }
      return error;
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  axoisRrequest
});
//# sourceMappingURL=request.js.map
