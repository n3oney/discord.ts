import {
    connectWebSocket,
    isWebSocketCloseEvent,
    WebSocket
} from "https://deno.land/std@0.61.0/ws/mod.ts";

export default class Socket {
    private _endpoint: string;
    private _messageListeners: Array<(msg: any) => any> = [];
    private _disconnectListeners: Array<() => any> = [];

    public sock?: WebSocket; // undefined before socket connects or if it fails to
    public parseJson: boolean;

    private receiver = async () => {
        for await (const msg of this.sock!) { // this.sock will definitely be assigned since receiver is started after assignment
            if(typeof msg === "string") {
                this._messageListeners.forEach(l => {
                    l(this.parseJson ? JSON.parse(msg) : msg);
                });
            } else if(isWebSocketCloseEvent(msg)) {
                this.sock = undefined;
                this._disconnectListeners.forEach(l => {
                    l();
                });
            } else {
                if(typeof msg === "object") {
                    this._messageListeners.forEach(l => {
                        l(this.parseJson ? msg : JSON.stringify(msg));
                    })
                }
            }
        }
    }

    public onMessage(callback: (msg: any) => any) {
        this._messageListeners.push(callback);
    }

    public onDisconnect(callback: () => any) {
        this._disconnectListeners.push(callback);
    }

    public send(msg: string | any) {
        return new Promise((resolve, reject) => {
            if(!this.sock) return reject(new Error("Socket isn't connected."));
            this.sock.send(typeof msg === "string" ? msg : JSON.stringify(msg)).then(() => resolve(), (e) => reject(e));
        })
    }

    constructor(endpoint: string, parseJson: boolean = false) {
        this.parseJson = parseJson;
        this._endpoint = endpoint;
        connectWebSocket(this._endpoint).then(sock => {
            this.sock = sock;
            // noinspection JSIgnoredPromiseFromCall
            this.receiver();
        })
    }
}

export enum Opcode {
    Dispatch,
    Heartbeat,
    Identify,
    PresenceUpdate,
    VoiceStateUpdate,
    Resume = 6, // There's no 5 opcode
    Reconnect,
    RequestGuildMembers,
    InvalidSession,
    Hello,
    HeartbeatACK
}