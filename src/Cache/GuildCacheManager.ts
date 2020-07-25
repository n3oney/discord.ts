import CacheManager from "./CacheManager.ts";
import Guild from "../Guild.ts";
import {Snowflake} from "../Snowflake.ts";
import {snakeToCamel} from "../Utils.ts";

export default class GuildCacheManager extends CacheManager<Guild> {
    fetch(id: Snowflake): Promise<Guild> {
        return new Promise(async (resolve, reject) => {
            this.client.restManager.get("/guilds/" + id).then(async res => {
                if(res.status === 200) {
                    const data = await res.json();
                    const g = new Guild({client: this.client, ...snakeToCamel(data)})
                    this.set(data.id, g);
                    resolve(g);
                } else reject();
            }, e => reject(e));
        });
    }
}