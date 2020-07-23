import Client from "./Client.ts";
import {Snowflake} from "./Snowflake.ts";

export interface GuildOptions {
    client: Client;
    id: Snowflake;
    preferredLocale?: string;
    rulesChannelId?: string;
    afkChannelId?: string;
    presences?: any[];
    maxVideoChannelUsers?: number;
    members?: any[];
    publicUpdatesChannelId?: string;
    premiumSubscriptionCount?: number;
    defaultMessageNotifications?: number;
    systemChannelId?: string;
    icon?: string;
    name?: string;
    features?: string[];
    region?: string;
    afkTimeout?: number;
    mfaLevel?: number;
    memberCount?: number;
    ownerId?: string;
    emojis?: any[];
    channels?: any[];
    unavailable?: boolean;
    verificationLevel?: number;
    roles?: any[];
}

export default class Guild {
    public client: Client;
    public id: Snowflake;
    public preferredLocale?: string;
    public rulesChannelId?: string;
    public afkChannelId?: string;
    public presences?: any[];
    public maxVideoChannelUsers?: number;
    public members?: any[];
    public publicUpdatesChannelId?: string;
    public premiumSubscriptionCount?: number;
    public defaultMessageNotifications?: number;
    public systemChannelId?: string;
    public icon?: string;
    public name?: string;
    public features?: string[];
    public region?: string;
    public afkTimeout?: number;
    public mfaLevel?: number;
    public memberCount?: number;
    public ownerId?: string;
    public emojis?: any[];
    public channels?: any[];
    public unavailable: boolean = true;
    public verificationLevel?: number;
    public roles?: any[];

    public setName(name: string): Promise<Guild> {
        return new Promise(async (resolve, reject) => {
            if(!this.client.restManager) return reject(new Error("Client isn't connected."));
            this.client.restManager.patch("/guilds/" + this.id, {
                name
            }).then(async response => {
                if(response.status === 200) {
                    this.name = name;
                    resolve(this);
                } else reject();
            }, e => reject(e));
        });
    }

    constructor(options: GuildOptions) {
        this.unavailable = options.hasOwnProperty("unavailable") ? Boolean(options.unavailable) : true;

        this.client = options.client;
        this.id = options.id;
        this.preferredLocale = options.preferredLocale;
        this.rulesChannelId = options.rulesChannelId;
        this.afkChannelId = options.afkChannelId;
        this.presences = options.presences;
        this.maxVideoChannelUsers = options.maxVideoChannelUsers;
        this.members = options.members;
        this.publicUpdatesChannelId = options.publicUpdatesChannelId;
        this.premiumSubscriptionCount = options.premiumSubscriptionCount;
        this.defaultMessageNotifications = options.defaultMessageNotifications;
        this.systemChannelId = options.systemChannelId;
        this.icon = options.icon;
        this.name = options.name;
        this.features = options.features;
        this.region = options.region;
        this.afkTimeout = options.afkTimeout;
        this.mfaLevel = options.mfaLevel;
        this.memberCount = options.memberCount;
        this.ownerId = options.ownerId;
        this.emojis = options.emojis;
        this.channels = options.channels;
        this.verificationLevel = options.verificationLevel;
        this.roles = options.roles;
    }
}