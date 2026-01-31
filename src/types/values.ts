import type { LGResponse } from "./response";
/**
 * LGInput
 */
export interface LGInput extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        returnValue?: boolean;
        subscribed: boolean;
        devices: [
            {
                id: string;
                label: string;
                port: number;
                connected: boolean;
                appId: string;
                icon: string;
                forceIcon: boolean;
                modified: boolean;
                lastUniqueId: number;
                hdmiPlugIn: boolean;
                hdmiSignalExist: boolean;
                subList: any;
                subCount: number;
                favorite: boolean;
            },
        ];
    };
}
/**
 * LGVolume old TV`s
 */
export interface LGVolumeChange extends Omit<LGResponse, "payload"> {
    payload?: {
        changed: string[];
        returnValue: boolean;
        cause: string;
        scenario: string;
        muted: boolean;
        volume: number;
        action: string;
        active: boolean;
    };
}
/**
 * LGVolume
 */
export interface LGVolume extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        returnValue: boolean;
        volumeStatus: {
            volumeLimitable: boolean;
            activeStatus: boolean;
            maxVolume: number;
            ossActivate: boolean;
            volumeLimiter: string;
            soundOutput: string;
            volume: number;
            mode: string;
            externalDeviceControl: boolean;
            muteStatus: boolean;
            volumeSyncable: boolean;
            adjustVolume: boolean;
        };
        callerId: string;
    };
}
/**
 * LGVolume
 */
export interface LGVolumeOld extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        muted?: boolean;
        mute?: boolean;
        scenario: string;
        active: boolean;
        action: string;
        volume: number;
        returnValue: boolean;
        subscribed: boolean;
    };
}
/**
 * LGChannelList
 */
export interface LGChannelList extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        returnValue: boolean;
        channelList: [
            {
                ATV: boolean;
                Bandwidth: number;
                CASystemIDList: any;
                CASystemIDListCount: number;
                DTV: boolean;
                Data: boolean;
                Frequency: number;
                GroupIdList: [
                    {
                        _id: string;
                        channelGroupId: number;
                        channelGroupName: string;
                    },
                ];
                HDTV: boolean;
                Handle: number;
                Invisible: boolean;
                Numeric: boolean;
                ONID: number;
                PrimaryCh: boolean;
                Radio: boolean;
                SVCID: number;
                TSID: number;
                TV: boolean;
                channelId: string;
                channelMajMinNo: string;
                channelMode: string;
                channelModeId: number;
                channelName: string;
                channelNumber: string;
                channelType: string;
                channelTypeId: number;
                configurationId: number;
                descrambled: boolean;
                favoriteGroup: string;
                fineTuned: boolean;
                locked: boolean;
                majorNumber: number;
                minorNumber: number;
                physicalNumber: number;
                programId: string;
                satelliteLcn: boolean;
                satelliteName: string;
                scrambled: boolean;
                serviceType: number;
                shortCut: number;
                signalChannelId: string;
                skipped: boolean;
                sourceIndex: number;
                specialService: boolean;
            },
        ];
    };
}
/**
 * LGVolume
 */
export interface LGTime extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        returnValue: boolean;
        time: {
            year: number;
            month: number;
            day: number;
            hour: number;
            minute: number;
            second: number;
        };
    };
}
/**
 * LGVolume
 */
export interface LGSystem extends Omit<LGResponse, "payload"> {
    /**
     * payload
     */
    payload?: {
        returnValue: boolean;
        product_name: string;
        model_name: string;
        sw_type: string;
        major_ver: string;
        minor_ver: string;
        country: string;
        country_group: string;
        device_id: string;
        auth_flag: string;
        ignore_disable: string;
        eco_info: string;
        config_key: string;
        language_code: string;
    };
}
/**
 * LGLaunch
 */
export interface LGLaunch extends Omit<LGResponse, "payload"> {
    payload?: {
        subscribed: boolean;
        launchPoints: [
            {
                badges?: any[];
                mediumLargeIcon: string;
                bgColor: string;
                installTime: number;
                systemApp: boolean;
                appDescription: string;
                launchPointId: string;
                bgImages: any[];
                lptype: string;
                relaunch: boolean;
                favicon: string;
                hidden: boolean;
                icon: string;
                removable: boolean;
                bgImage: string;
                largeIcon: string;
                id: string;
                iconColor: string;
                tileSize: string;
                userData: string;
                previewMetadata?: any;
                params: any;
                unmovable: boolean;
                extraLargeIcon: string;
                imageForRecents: string;
                miniicon: string;
                title: string;
                titleVisible: boolean;
            },
        ];
        returnValue: boolean;
        caseDetail: any;
    };
}
/**
 * LGApps
 */
export interface LGApps extends Omit<LGResponse, "payload"> {
    payload?: {
        subscribed: boolean;
        returnValue: boolean;
        apps: [
            {
                closeOnBackground: boolean;
                networkStableTimeout: number;
                checkUpdateOnLaunch: boolean;
                requiredPermissions?: any[];
                class?: any;
                title: string;
                allowWidget: boolean;
                icon: string;
                tileSize: string;
                inAppSetting: boolean;
                closeOnRotation: boolean;
                nativeLifeCycleInterfaceVersion: number;
                folderPath: string;
                transparent: boolean;
                version: string;
                trustLevel: string;
                hasPromotion: boolean;
                enableCBSPolicy: boolean;
                lockable: boolean;
                systemApp: boolean;
                mediumLargeIcon: string;
                main: string;
                visible: boolean;
                privilegedJail: boolean;
                inspectable: boolean;
                defaultWindowType: string;
                vendor: string;
                accessibility: any;
                deeplinkingParams: string;
                activeFolderPath: string;
                type: string;
                supportTouchMode: string;
                spinnerOnLaunch: boolean;
                installTime: number;
                disableBackHistoryAPI: boolean;
                id: string;
                enableBackgroundRun: boolean;
                handlesRelaunch: boolean;
                noSplashOnLaunch: boolean;
                useCORSWhitelist: string;
                removable: boolean;
                CPApp: boolean;
                uiRevision: number;
                unmovable: boolean;
                previewMetadata?: any;
            },
        ];
    };
}
/**
 * LGAppId
 */
export interface LGAppId extends Omit<LGResponse, "payload"> {
    payload?: {
        subscribed: boolean;
        returnValue: boolean;
        appId: string;
        appCategory: any[];
        processId: string;
        windowId: string;
    };
}

/**
 * LGVolume
 */
export interface LGChannel extends Omit<LGResponse, "payload"> {
    payload?: {
        returnValue: boolean;
        channel?: {
            waterMarkUrl: string;
            lastUpdated: string;
            ipChanCpId: string;
            channelNumber: string;
            channelId: string;
            ipChanInteractive: boolean;
            subChannelId: any;
            ipChanCategory: string;
            payChan: boolean;
            satelliteName: string;
            sourceIndex: number;
            ipChanServerUrl: string;
            signalChannelId: string;
            CASystemIDList: any;
            HDTV: boolean;
            channelGenreCode: string;
            shortCut: number;
            playerService: string;
            DTV: boolean;
            display: number;
            programId: string;
            channelTypeId: number;
            ATV: boolean;
            adultFlag: number;
            Radio: boolean;
            ipCallNumber: string;
            majorNumber: number;
            physicalNumber: number;
            Data: boolean;
            skipped: boolean;
            specialService: boolean;
            minorNumber: number;
            PrimaryCh: boolean;
            isFreeviewPlay: number;
            favoriteIdxB: number;
            groupIdList: any[];
            callSign: string;
            favoriteIdxA: number;
            IPChannelCode: string;
            favoriteIdxC: number;
            Numeric: boolean;
            Invisible: boolean;
            locked: boolean;
            descrambled: boolean;
            CASystemIDListCount: number;
            satelliteLcn: boolean;
            favoriteGroup: any[];
            favoriteIdxD: number;
            otuFlag: boolean;
            ipChanType: string;
            priority: number;
            imgUrl2: string;
            channelLogoSize: string;
            imgUrl: string;
            favoriteIdxE: number;
            uniqueIdentifier: string;
            channelName: string;
            configurationId: number;
            TV: boolean;
            hasBackward: number;
            favoriteIdxF: number;
            fineTuned: boolean;
            channelModeId: number;
            configured: boolean;
            chanCode: string;
            adFlag: number;
            SVCID: number;
            Frequency: number;
            channelMode: string;
            favoriteIdxG: number;
            TSID: number;
            numUnSel: boolean;
            scrambled: boolean;
            channelNameSortKey: string;
            rfIpChannel: boolean;
            favoriteIdxH: number;
            channelType: string;
            serviceType: number;
            Bandwidth: number;
            ONID: number;
        };
        programList: any[];
    };
}
export interface LGProgram extends Omit<LGResponse, "payload"> {
    payload?: {
        programId: string;
        programName: string;
        description: string;
        startTime: string;
        endTime: string;
        localStartTime: string;
        localEndTime: string;
        duration: number;
        channelId: string;
        channelName: string;
        channelNumber: string;
        channelMode: string;
    };
}
export interface LGChannelSwitch extends Omit<LGResponse, "payload"> {
    payload?: {
        subscribed: boolean;
        channelTypeName: string;
        isFineTuned: boolean;
        channelNumber: string;
        channelName: string;
        isSkipped: boolean;
        signalChannelId: string;
        isLocked: boolean;
        isHEVCChannel: boolean;
        channelModeId: number;
        isScrambled: boolean;
        favoriteGroup: string;
        physicalNumber: number;
        hybridtvType: any;
        isDescrambled: boolean;
        channelModeName: string;
        channelId: string;
        channelTypeId: number;
        dualChannel: any;
        isinvisible: boolean;
    };
}

export interface LGFeatures extends Omit<LGResponse, "payload"> {
    payload?: {
        features?: {
            "3d": boolean;
            dvr: boolean;
        };
        receiverType?: string;
        modelName?: string;
        returnValue: boolean;
        configs?: {
            "tv.model.3dSupportType": string;
            "tv.model.modelname": string;
            "tv.model.sysType": string;
            "tv.model.serialnumber": string;
        };
    };
}

export interface LGPowerState extends Omit<LGResponse, "payload"> {
    payload?: {
        state: string;
        returnValue: boolean;
    };
}

export interface LGPictureSettings extends Omit<LGResponse, "payload"> {
    payload?: {
        returnValue: boolean;
        subscribed: boolean;
        category: string;
        settings: any;
    };
}
