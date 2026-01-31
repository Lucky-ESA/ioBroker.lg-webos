import type { ConfigDevice } from "../types/device";
import type { States } from "../types/states";
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
} from "../types/values";

/**
 * Update ioBroker states
 */
export class updateStates implements States {
    private dev: ConfigDevice;
    private adapter: ioBroker.Adapter;
    private input: { [key in string]: string } = {};
    //private oldValue: { [key in string]: string | undefined } = {};

    /**
     * @param device States (Datapoints)
     * @param iob ioBroker.Adapter
     */
    constructor(
        readonly device: ConfigDevice,
        readonly iob: ioBroker.Adapter,
    ) {
        this.dev = device;
        this.adapter = iob;
        if (this.dev.dp == undefined) {
            this.adapter.log.error(`Missing Object ID!!!!`);
        }
    }

    /**
     * Create possible inputs
     *
     * @param val Input
     */
    public updateInuptValue(val: LGInput): void {
        if (this.dev.dp != undefined && val.payload != undefined && !val.payload.returnValue) {
            for (const device of val.payload.devices) {
                if (!this.input[device.appId]) {
                    this.input[device.appId] = device.label;
                }
            }
        }
    }

    /**
     * Update Volume
     *
     * @param val Volume
     */
    public async updateOutput(val: LGVolume): Promise<void> {
        if (val.payload) {
            if (val.payload.volumeStatus && val.payload.volumeStatus.soundOutput != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.soundOutput`, {
                    val: val.payload.volumeStatus.soundOutput,
                    ack: true,
                });
            }
            if (val.payload.volumeStatus && val.payload.volumeStatus.volume != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.volume`, {
                    val: val.payload.volumeStatus.volume,
                    ack: true,
                });
            }
            if (val.payload.volumeStatus && val.payload.volumeStatus.muteStatus != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
                    val: val.payload.volumeStatus.muteStatus,
                    ack: true,
                });
            }
        }
    }

    /**
     * Update Volume old TV`s
     *
     * @param val Volume
     */
    public async updateOutputOld(val: LGVolumeChange): Promise<void> {
        if (val.payload) {
            if (val.payload.scenario != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.soundOutput`, {
                    val: val.payload.scenario,
                    ack: true,
                });
            }
            if (val.payload.volume != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.volume`, {
                    val: val.payload.volume,
                    ack: true,
                });
            }
            if (val.payload.muted != null) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
                    val: val.payload.muted,
                    ack: true,
                });
            }
        }
    }

    /**
     * Update APPID
     *
     * @param val AppId
     */
    public async updateAppId(val: LGAppId): Promise<void> {
        if (val.payload) {
            const appid = val.payload.appId;
            let hdmi = "unknown";
            if ((typeof appid === "string" && appid.includes("hdmi")) || this.input[appid]) {
                hdmi = appid;
            }
            await this.adapter.setState(`${this.dev.dp}.remote.states.input`, {
                val: hdmi,
                ack: true,
            });
            await this.adapter.setState(`${this.dev.dp}.remote.states.launch`, {
                val: appid,
                ack: true,
            });
        }
    }
    /**
     * Update Channel
     *
     * @param val Channel
     */
    public async updateChannel(val: LGChannel): Promise<void> {
        if (val.payload) {
            if (val.payload.channel) {
                const channel = val.payload.channel;
                await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
                    val: Number(channel.channelNumber),
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
                    val: channel.channelId,
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
                    val: channel.channelType,
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
                    val: channel.channelName,
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
                    val: channel.channelMode,
                    ack: true,
                });
            }
        }
    }
    /**
     * Clean-Up Channel
     */
    public async cleanUpChannel(): Promise<void> {
        await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
            val: 0,
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
            val: "0_0_0_0_0",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
            val: "",
            ack: true,
        });

        await this.adapter.setState(`${this.dev.dp}.remote.states.programId`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.programName`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.programDesc`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
            val: "",
            ack: true,
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.programDuration`, {
            val: 0,
            ack: true,
        });
    }
    /**
     * Update Program
     *
     * @param val Program
     */
    public async updateProgram(val: LGProgram): Promise<void> {
        if (val.payload) {
            if (val.payload.programId) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programId`, {
                    val: val.payload.programId,
                    ack: true,
                });
            }
            if (val.payload.programName) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programName`, {
                    val: val.payload.programName,
                    ack: true,
                });
            }
            if (val.payload.programName) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programDesc`, {
                    val: val.payload.description,
                    ack: true,
                });
            }
            if (val.payload.localStartTime) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
                    val: this.convertTimeString(val.payload.localStartTime),
                    ack: true,
                });
            } else if (val.payload.startTime) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
                    val: this.convertTimeString(val.payload.startTime),
                    ack: true,
                });
            }
            if (val.payload.localEndTime) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
                    val: this.convertTimeString(val.payload.localEndTime),
                    ack: true,
                });
            } else if (val.payload.endTime) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
                    val: this.convertTimeString(val.payload.endTime),
                    ack: true,
                });
            }
            if (val.payload.duration) {
                await this.adapter.setState(`${this.dev.dp}.remote.states.programDuration`, {
                    val: val.payload.duration,
                    ack: true,
                });
            }
        }
    }
    /**
     * Convert Time String
     *
     * @param t time string e.g. 2026,01,17,17,13,46
     */
    public convertTimeString(t: string): string {
        return `${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}:${t[5]}`;
        //return new Date(`${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}:${t[5]}`);
    }
    /**
     * Update ChannelSwitch
     *
     * @param val ChannelSwitch
     */
    public async updateChannelSwitch(val: LGChannelSwitch): Promise<void> {
        if (val.payload) {
            if (val.payload.channelTypeName) {
                const channel = val.payload;
                await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
                    val: Number(channel.channelNumber),
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
                    val: channel.channelId,
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
                    val: channel.channelTypeName != null ? channel.channelTypeName : "",
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
                    val: channel.channelName,
                    ack: true,
                });
                await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
                    val: channel.channelModeName,
                    ack: true,
                });
            }
        }
    }

    /**
     * Update Power State
     *
     * @param val Power State
     */
    public async updatePowerState(val: LGPowerState): Promise<void> {
        if (val.payload && val.payload.state) {
            await this.adapter.setState(`${this.dev.dp}.status.powerState`, {
                val: val.payload.state,
                ack: true,
            });
        }
    }

    /**
     * Update System Pictures Settings
     *
     * @param val Pictures Settings
     */
    public async updateSettings(val: LGPictureSettings): Promise<void> {
        if (this.dev.dp != undefined && val.payload != undefined) {
            let new_val: string | number | boolean = "";
            for (const attribute in val.payload.settings) {
                switch (attribute) {
                    case "brightness":
                    case "backlight":
                    case "contrast":
                    case "color":
                    case "sharpness":
                    case "tint":
                        new_val = Number(val.payload.settings[attribute]);
                        break;
                    case "wolwowlOnOff":
                        new_val = val.payload.settings[attribute] == "true" ? true : false;
                        break;
                    case "eyeComfortMode":
                    case "realCinema":
                    case "motionEyeCare":
                        new_val = val.payload.settings[attribute] == "on" ? true : false;
                        break;
                    case "blackLevel":
                        new_val = JSON.stringify(val.payload.settings[attribute]);
                        break;
                    default:
                        new_val = val.payload.settings[attribute];
                }
                if (val.payload.settings[attribute] != undefined && new_val != "") {
                    await this.adapter.setState(`${this.dev.dp}.remote.settings.${attribute}`, {
                        val: new_val,
                        ack: true,
                    });
                }
            }
        }
    }
}
