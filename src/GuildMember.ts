import User from "./User.ts";
import {Snowflake} from "./Snowflake.ts";
import Client from "./Client.ts";
import Guild from "./Guild.ts";

export interface GuildMemberOptions {
    user: User;
    roles: Snowflake[]
    nickname?: string;
    mute?: boolean;
    deaf?: boolean;
    joinedAt: Date | string;
    client: Client;
    guild: Guild;
}

export default class GuildMember {
    public user: User;
    public roles: Snowflake[];
    public nickname?: string;
    public mute: boolean;
    public deaf: boolean;
    public joinedAt: Date;
    public client: Client;
    public guild: Guild;

    public get displayName(): string {
        if(typeof this.nickname === "string") return this.nickname;
        else return this.user.username;
    }

    constructor(options: GuildMemberOptions) {
        this.user = options.user;
        this.roles = options.roles;
        this.nickname = options.nickname;
        this.mute = !!options.mute;
        this.deaf = !!options.deaf;
        if(typeof options.joinedAt === "string") this.joinedAt = new Date(options.joinedAt);
        else this.joinedAt = options.joinedAt;
        this.client = options.client;
        this.guild = options.guild;
    }
}