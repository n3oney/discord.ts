import CacheManager from "./CacheManager.ts";
import Guild from "../Guild.ts";
import {Snowflake} from "../Snowflake.ts";
import {snakeToCamel} from "../Utils.ts";
import GuildMember from "../GuildMember.ts";
import Client from "../Client.ts";
import User from "../User.ts";

export default class GuildMemberCacheManager extends CacheManager<GuildMember> {
    public guild: Guild;

    fetch(limit?: number): Promise<Map<Snowflake, GuildMember>>;
    fetch(id: Snowflake): Promise<GuildMember>;

    fetch(arg0?: Snowflake | number) {
        return new Promise(async (resolve, reject) => {
            if(typeof arg0 === "string") {
                this.client.restManager.get("/guilds/" + this.guild.id + "/members/" + arg0).then(async res => {
                    if (res.status === 200) {
                        const data = await res.json();
                        let options = snakeToCamel(data);
                        options.user = new User({...options.user, client: this.client});
                        this.client.users.set(options.user.id, options.user);
                        const g = new GuildMember({client: this.client, guild: this.guild, ...options});
                        this.set(data.user.id, g);
                        resolve(g);
                    } else reject();
                }, e => reject(e));
            } else {
                if(!arg0) arg0 = 100;
                this.client.restManager.get("/guilds/" + this.guild.id + "/members", {
                    limit: arg0
                }).then(async res => {
                    if(res.status === 200) {
                        const newMap = new Map<Snowflake, GuildMember>();
                        for(let member of await res.json()) {
                            let options = snakeToCamel(member);
                            options.user = new User({...options.user, client: this.client});
                            const g = new GuildMember({client: this.client, guild: this.guild, ...options});
                            this.set(member.user.id, g);
                            newMap.set(member.user.id, g);
                        }
                        resolve(newMap);
                    } else reject();
                }, e => reject(e));
            }
        });
    }

    constructor(client: Client, guild: Guild) {
        super(client);
        this.guild = guild;
    }
}