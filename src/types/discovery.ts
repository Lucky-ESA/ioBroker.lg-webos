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
     * destroy
     */
    destroy(): void;
}
