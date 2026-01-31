import type {
    LGApps,
    LGChannelList,
    LGFeatures,
    LGInput,
    LGLaunch,
    LGPictureSettings,
    LGPowerState,
    LGVolume,
    LGVolumeOld,
} from "./values";
/**
 * Objects
 */
export interface Objects {
    /**
     * createDevice
     */
    createDevice(): Promise<any>;
    /**
     * createOutput
     *
     * @param val LGVolume
     */
    createOutput(val: LGVolume): Promise<any>;
    /**
     * createInput
     *
     * @param val LGInput
     */
    createInput(val: LGInput): Promise<any>;
    /**
     * createLaunch
     *
     * @param val LGLaunch
     */
    createLaunch(val: LGLaunch): Promise<any>;
    /**
     * createApps
     *
     * @param val LGApps
     */
    createApps(val: LGApps): Promise<any>;
    /**
     * Create Channel list
     *
     * @param val channels
     */
    createChannelList(val: LGChannelList): Promise<void>;
    /**
     * Create features e.g. 3D Object
     *
     * @param val Features
     */
    createFeatures(val: LGFeatures): Promise<void>;
    /**
     * Create Volume State old TV´s
     *
     * @param val Volume
     */
    createOutputOld(val: LGVolumeOld): Promise<void>;
    /**
     * Create Info power state
     *
     * @param val Power State
     */
    createPowerState(val: LGPowerState): Promise<void>;
    /**
     * Create connection for pointer events
     */
    createPointerConnection(): Promise<void>;
    /**
     * Create System Pictures Settings
     *
     * @param val Pictures Settings
     */
    createSettings(val: LGPictureSettings): Promise<void>;
}

/**
 * Common States
 */
export type CommonStates = {
    name:
        | {
              en: string;
              de: string;
              ru: string;
              pt: string;
              nl: string;
              fr: string;
              it: string;
              es: string;
              pl: string;
              uk: string;
              "zh-cn": string;
          }
        | string;
    desc: string;
    statusStates?: {
        onlineId: string;
    };
    icon?: string | null;
    type?: "string" | "number" | "button" | "boolean";
    role?:
        | "json"
        | "button.stop"
        | "button.pause"
        | "button.start"
        | "switch"
        | "state"
        | "button"
        | "value"
        | "button.volume.up"
        | "button.fastforward"
        | "indicator.connected"
        | "button.volume.down"
        | "value.brightness"
        | "date.start"
        | "date.end"
        | "time.span";
    write?: boolean;
    read?: boolean;
    def?: string | number | boolean;
    state?: "device" | "channel" | "state";
    states?: { [key in string]: string };
    min?: number;
    max?: number;
    unit?: number | string;
    step?: number;
};

export interface AxiosResponse<T = any> {
    data: T;
    message: string;
    status: boolean;
}
