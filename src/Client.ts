import {defaultEventValues, Event} from "./Event.ts";
import Socket, {Opcode} from "./Socket.ts";
import User from "./User.ts";
import RestManager from "./RestManager.ts";
import Guild from "./Guild.ts";
import {snakeToCamel} from "./Utils.ts";
import GuildCacheManager from "./Cache/GuildCacheManager.ts";
import UserCacheManager from "./Cache/UserCacheManager.ts";

class Client {
    private _heartbeatInterval?: number;
    private _s: string | null = null;
    private _token?: string; // NOTE - THIS IS THE "STORAGE" FOR THE GETTER AND SETTER FOR THE PUBLIC token - WITH IT WE CAN PREPEND A "Bot "

    public user?: User;
    public eventHandlers: { [key in Event]: Function[] };
    public socket?: Socket;
    public restManager = new RestManager(this);
    public guilds = new GuildCacheManager(this);
    public users = new UserCacheManager(this);

    public get token(): string | undefined {
        return this._token;
    }

    public set token(newVal: string | undefined) {
        if (typeof newVal === "undefined")
            this._token = newVal;
        else if (newVal.startsWith("Bot "))
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
        this.eventHandlers[Event.Raw].forEach(l => l.bind(this)(message));
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
        } else if (message.op === Opcode.Heartbeat) {
            // Requested heartbeat
            await this.socket!.send({
                op: Opcode.Heartbeat,
                d: this._s
            });
        } else if (message.op === Opcode.Dispatch) {
            if (message.t === "READY") {
                this.user = new User({
                    username: message.d.user.username,
                    id: message.d.user.id,
                    discriminator: message.d.user.discriminator,
                    bot: message.d.user.bot,
                    avatar: message.d.user.avatar,
                    client: this
                });
                for (let guild of message.d.guilds) {
                    this.guilds.set(guild.id, new Guild({client: this, ...snakeToCamel(guild)}));
                }
                this.eventHandlers[Event.Ready].forEach(l => l.bind(this)());
            } else if(message.t === "GUILD_CREATE") {
                const g = new Guild({client: this, ...snakeToCamel(message.d)})
                this.guilds.set(message.d.id, g);
                this.eventHandlers[Event.GuildCreate].forEach(l => l.bind(this)(g))
            }
        }
    }

    private async _onHttpResponse(res: Response) {
        this.eventHandlers[Event.Http].forEach(l => l.bind(this)(res));
    }

    async login(token: string) {
        this.token = token;
        this.socket = new Socket("wss://gateway.discord.gg/?v=6&encoding=json", true);
        this.socket.onMessage(this._onSocketMessage.bind(this));
        this.restManager.onResponse(this._onHttpResponse.bind(this));
    }

    constructor() {
        // @ts-ignore   "Property 'eventHandlers' is used before being assigned." without that.
        if (!this.eventHandlers || typeof this.eventHandlers === "undefined") this.eventHandlers = defaultEventValues;
    }
}

export default Client;