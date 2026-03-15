/**
 * Discovery
 */
export interface Discovery {
    /**
     * Start watching
     *
     * @param ip Device IP
     */
    discovery(ip: string): void;
    /**
     * Actived MDNS Log
     */
    mdnLog(val: boolean): void;
    /**
     * destroy
     */
    destroy(): void;
    /**
     * Change Message
     *
     * @param msg Message
     */
    setMsg(msg: string): void;
    /**
     * Change IP
     *
     * @param ip IP
     */
    setIp(ip: string): void;
    /**
     * Change Port
     *
     * @param port Port
     */
    setPort(port: string): void;
    /**
     * Set SSDP Data
     *
     * @param dp Object Device
     */
    setData(dp: string): Promise<void>;
}
