import type { AxiosResponse } from "../types/object";
/**
 * AxiosRrequest
 */
export interface AxiosRrequest {
    /**
     * @param url Icon URL
     * @returns axios response
     */
    get(url: string): Promise<AxiosResponse>;
}
