import {Event} from "./Event.ts";
import Socket, {Opcode} from "./Socket.ts";
import User from "./User.ts";

class Client {
    private _heartbeatInterval?: number;
    private _s: string | null = null;
    private _token?: string;

    public user?: User;
    public eventHandlers: { [key in Event]: Function[] };
    public socket?: Socket;

    get token(): string | undefined {
        return this._token;
    }

    set token(newVal: string | undefined) {
        if(typeof newVal === "undefined")
            this._token = newVal;
        else if(newVal.startsWith("Bot "))
            this._token = newVal;
        else this._token = "Bot " + newVal;
    }

    private async _sendHeartbeat() {
        await this.socket!.send({
            op: Opcode.Heartbeat,
            d: this._s
        });
        setTimeout(this._sendHeartbeat.bind(this), this._heartbeatInterval);
    }

    private async _onSocketMessage(message: any) {
        this.eventHandlers[Event.Raw].forEach(l => l.bind(this)());
        this._s = message.s;
        if (message.op === Opcode.Hello) {
            this._heartbeatInterval = message.d.heartbeat_interval;
            setTimeout(this._sendHeartbeat.bind(this), this._heartbeatInterval);
            // Identify
            await this.socket!.send({
                op: Opcode.Identify,
                d: {
                    token: this.token,
                    properties: {
                        $os: Deno.build.os,
                        $browser: "discord.ts",
                        $device: "discord.ts"
                    }
                }
            });
        } else if(message.op === Opcode.Heartbeat) {
            // Requested heartbeat
            await this.socket!.send({
                op: Opcode.Heartbeat,
                d: this._s
            });
        } else if (message.op === Opcode.Dispatch && message.t === "READY") {
            this.user = new User({
                username: message.d.user.username,
                id: message.d.user.id,
                discriminator: message.d.user.discriminator,
                bot: message.d.user.bot,
                avatar: message.d.user.avatar
            });
            this.eventHandlers[Event.Ready].forEach(l => l.bind(this)());
        }
    }

    async login(token: string) {
        this.token = token;
        this.socket = new Socket("wss://gateway.discord.gg/?v=6&encoding=json", true);
        this.socket.onMessage(this._onSocketMessage.bind(this));
    }

    constructor() {
        // @ts-ignore   "Property 'eventHandlers' is used before being assigned." without that.
        if (!this.eventHandlers || typeof this.eventHandlers === "undefined") this.eventHandlers = {
            [Event.Message]: [],
            [Event.Raw]: [],
            [Event.Ready]: []
        };
    }
}

export default Client;