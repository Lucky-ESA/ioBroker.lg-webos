import { default as axios, AxiosError } from "axios";
import * as https from "node:https";
import type { AxiosResponse } from "../types/object";
import type { AxiosRrequest } from "../types/request";
/**
 * Axios Handler
 */
export class axoisRrequest implements AxiosRrequest {
    private requestClient: any;

    /**
     * Axios Handler
     */
    constructor() {
        this.requestClient = axios.create({
            timeout: 10000,
            withCredentials: true,
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Content-Type": "image/png",
                "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
    }

    /**
     * @param url Icon URL
     * @returns axios response
     */
    public async get(url: string): Promise<AxiosResponse> {
        return await this.requestClient({
            method: "GET",
            url: url,
            responseType: "arraybuffer",
        })
            .then((res: AxiosResponse) => {
                return res;
            })
            .catch((err: any) => {
                let error = "";
                if (err instanceof AxiosError) {
                    error = err.response ? err.response.data : "Server Unavailable";
                } else if (err instanceof Error) {
                    error = err.message;
                }
                return error;
            });
    }
}
