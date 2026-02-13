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
}
