"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var states_exports = {};
__export(states_exports, {
  updateStates: () => updateStates
});
module.exports = __toCommonJS(states_exports);
class updateStates {
  //private oldValue: { [key in string]: string | undefined } = {};
  /**
   * @param device States (Datapoints)
   * @param iob ioBroker.Adapter
   */
  constructor(device, iob) {
    this.device = device;
    this.iob = iob;
    this.dev = device;
    this.adapter = iob;
    if (this.dev.dp == void 0) {
      this.adapter.log.error(`Missing Object ID!!!!`);
    }
  }
  dev;
  adapter;
  input = {};
  /**
   * Create possible inputs
   *
   * @param val Input
   */
  updateInuptValue(val) {
    if (this.dev.dp != void 0 && val.payload != void 0 && !val.payload.returnValue) {
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
  async updateOutput(val) {
    if (val.payload) {
      if (val.payload.volumeStatus && val.payload.volumeStatus.soundOutput != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.soundOutput`, {
          val: val.payload.volumeStatus.soundOutput,
          ack: true
        });
      }
      if (val.payload.volumeStatus && val.payload.volumeStatus.volume != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.volume`, {
          val: val.payload.volumeStatus.volume,
          ack: true
        });
      }
      if (val.payload.volumeStatus && val.payload.volumeStatus.muteStatus != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
          val: val.payload.volumeStatus.muteStatus,
          ack: true
        });
      }
    }
  }
  /**
   * Update Volume old TV`s
   *
   * @param val Volume
   */
  async updateOutputOld(val) {
    if (val.payload) {
      if (val.payload.scenario != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.soundOutput`, {
          val: val.payload.scenario,
          ack: true
        });
      }
      if (val.payload.volume != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.volume`, {
          val: val.payload.volume,
          ack: true
        });
      }
      if (val.payload.muted != null) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.mute`, {
          val: val.payload.muted,
          ack: true
        });
      }
    }
  }
  /**
   * Update APPID
   *
   * @param val AppId
   */
  async updateAppId(val) {
    if (val.payload) {
      const appid = val.payload.appId;
      let hdmi = "unknown";
      if (typeof appid === "string" && appid.includes("hdmi") || this.input[appid]) {
        hdmi = appid;
      }
      await this.adapter.setState(`${this.dev.dp}.remote.states.input`, {
        val: hdmi,
        ack: true
      });
      await this.adapter.setState(`${this.dev.dp}.remote.states.launch`, {
        val: appid,
        ack: true
      });
    }
  }
  /**
   * Update Channel
   *
   * @param val Channel
   */
  async updateChannel(val) {
    if (val.payload) {
      if (val.payload.channel) {
        const channel = val.payload.channel;
        await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
          val: Number(channel.channelNumber),
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
          val: channel.channelId,
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
          val: channel.channelType,
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
          val: channel.channelName,
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
          val: channel.channelMode,
          ack: true
        });
      }
    }
  }
  /**
   * Clean-Up Channel
   */
  async cleanUpChannel() {
    await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
      val: 0,
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
      val: "0_0_0_0_0",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programId`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programName`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programDesc`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
      val: "",
      ack: true
    });
    await this.adapter.setState(`${this.dev.dp}.remote.states.programDuration`, {
      val: 0,
      ack: true
    });
  }
  /**
   * Update Program
   *
   * @param val Program
   */
  async updateProgram(val) {
    if (val.payload) {
      if (val.payload.programId) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programId`, {
          val: val.payload.programId,
          ack: true
        });
      }
      if (val.payload.programName) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programName`, {
          val: val.payload.programName,
          ack: true
        });
      }
      if (val.payload.programName) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programDesc`, {
          val: val.payload.description,
          ack: true
        });
      }
      if (val.payload.localStartTime) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
          val: this.convertTimeString(val.payload.localStartTime),
          ack: true
        });
      } else if (val.payload.startTime) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programStart`, {
          val: this.convertTimeString(val.payload.startTime),
          ack: true
        });
      }
      if (val.payload.localEndTime) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
          val: this.convertTimeString(val.payload.localEndTime),
          ack: true
        });
      } else if (val.payload.endTime) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programEnd`, {
          val: this.convertTimeString(val.payload.endTime),
          ack: true
        });
      }
      if (val.payload.duration) {
        await this.adapter.setState(`${this.dev.dp}.remote.states.programDuration`, {
          val: val.payload.duration,
          ack: true
        });
      }
    }
  }
  /**
   * Convert Time String
   *
   * @param t time string e.g. 2026,01,17,17,13,46
   * @returns times string
   */
  convertTimeString(t) {
    return `${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}:${t[5]}`;
  }
  /**
   * Update ChannelSwitch
   *
   * @param val ChannelSwitch
   */
  async updateChannelSwitch(val) {
    if (val.payload) {
      if (val.payload.channelTypeName) {
        const channel = val.payload;
        await this.adapter.setState(`${this.dev.dp}.remote.states.channel`, {
          val: Number(channel.channelNumber),
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelId`, {
          val: channel.channelId,
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelType`, {
          val: channel.channelTypeName != null ? channel.channelTypeName : "",
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelName`, {
          val: channel.channelName,
          ack: true
        });
        await this.adapter.setState(`${this.dev.dp}.remote.states.channelModel`, {
          val: channel.channelModeName,
          ack: true
        });
      }
    }
  }
  /**
   * Update Power State
   *
   * @param val Power State
   */
  async updatePowerState(val) {
    if (val.payload && val.payload.state) {
      await this.adapter.setState(`${this.dev.dp}.status.powerState`, {
        val: val.payload.state,
        ack: true
      });
    }
  }
  /**
   * Update System Pictures Settings
   *
   * @param val Pictures Settings
   */
  async updateSettings(val) {
    if (this.dev.dp != void 0 && val.payload != void 0) {
      let new_val = "";
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
        if (val.payload.settings[attribute] != void 0 && new_val != "") {
          await this.adapter.setState(`${this.dev.dp}.remote.settings.${attribute}`, {
            val: new_val,
            ack: true
          });
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateStates
});
//# sourceMappingURL=states.js.map
