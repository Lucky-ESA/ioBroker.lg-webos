import type {
    LGAppId,
    LGChannel,
    LGChannelSwitch,
    LGInput,
    LGPictureSettings,
    LGPowerState,
    LGProgram,
    LGVolume,
    LGVolumeChange,
} from "./values";
/**
 * States
 */
export interface States {
    /**
     * updateOutput
     *
     * @param val LGVolume
     */
    updateOutput(val: LGVolume): Promise<any>;
    /**
     * updateAppId
     *
     * @param val updateAppId
     */
    updateAppId(val: LGAppId): Promise<any>;
    /**
     * updateChannel
     *
     * @param val updateChannel
     */
    updateChannel(val: LGChannel): Promise<any>;
    /**
     * updateChannelSwitch
     *
     * @param val updateChannelSwitch
     */
    updateChannelSwitch(val: LGChannelSwitch): Promise<any>;
    /**
     * Update Volume old TV`s
     *
     * @param val Volume
     */
    updateOutputOld(val: LGVolumeChange): Promise<void>;
    /**
     * Update Power State
     *
     * @param val Power State
     */
    updatePowerState(val: LGPowerState): Promise<void>;
    /**
     * Update System Pictures Settings
     *
     * @param val Pictures Settings
     */
    updateSettings(val: LGPictureSettings): Promise<void>;
    /**
     * Update Program
     *
     * @param val Program
     */
    updateProgram(val: LGProgram): Promise<void>;
    /**
     * Clean-Up Channel
     */
    cleanUpChannel(): Promise<void>;
    /**
     * Create possible inputs
     *
     * @param val Input
     */
    updateInuptValue(val: LGInput): void;
}
