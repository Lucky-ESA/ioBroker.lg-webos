/**
 * Device
 */
export interface Device {
    /**
     * destroy
     */
    destroy(): void;
    /**
     * @param id id
     * @param type types
     * @param uri uri address
     * @param payload pairing
     */
    request(id: string, type: string, uri?: string, payload?: any): void;
    /**
     * @param type types
     * @param uri uri address
     * @param payload pairing
     */
    own_request(type: string, uri: string, payload?: any): void;
    /**
     * Wake on lan
     *
     * @param id ioBroker object id
     */
    wol(id: string): Promise<void>;
    /**
     * @param obj Message
     */
    message(obj: ioBroker.Message): void;
    /**
     * Sends a message direct
     *
     * @param obj Message
     */
    messageDirect(obj: ioBroker.Message): Promise<void>;
    /**
     * Actived MDNS Log
     */
    mdnLog(val: boolean): void;
    /**
     * Sends a toast message
     *
     * @param id ioBroker object id
     * @param type Message type
     * @param uri Endpoint
     * @param payload Payload data
     */
    MessageHandler(id: string, type: string, uri?: string, payload?: any): Promise<void>;
}

/**
 * Response Checker
 */
export interface respCheck {
    id: string;
    type: string;
    uri: string;
    response: string;
    error: string;
    errorCode: number;
    errorText: string;
    settings: string;
    subscribe: boolean;
    category: string;
}

/**
 * Device status
 */
export type Status = {
    ip: string;
    status: boolean;
};

/**
 * Config Devices Json
 */
export type ConfigDevice = {
    active: boolean;
    ws: string;
    tvname: string | null;
    ip: string;
    mac: string;
    interval: number;
    luna: boolean;
    oldDevice: boolean;
    picture: boolean;
    dp?: string;
};

/**
 * Pointer Messages JSON
 */
export type pointerJson = {
    type?: string;
    uri?: string;
    payload?: any;
    first?: any;
    prefix?: string;
};
