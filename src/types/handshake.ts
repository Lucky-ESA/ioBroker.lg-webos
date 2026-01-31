export type handshake = {
    forcePairing: boolean;
    pairingType: string;
    "client-key"?: string;
    manifest: {
        manifestVersion: number;
        appVersion: string;
        signed: {
            created: string;
            appId: string;
            vendorId: string;
            localizedAppNames: any;
            localizedVendorNames: any;
            permissions: string[];
            serial: string;
        };
        permissions: string[];
        signatures: any[];
    };
};
