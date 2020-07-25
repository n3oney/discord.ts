import CacheManager from "./CacheManager.ts";
import User from "../User.ts";
import {Snowflake} from "../Snowflake.ts";

export default class UserCacheManager extends CacheManager<User> {
    public fetch(id: Snowflake): Promise<User> {
        return new Promise(async (resolve, reject) => {
            this.client.restManager.get("/users/" + id).then(async response => {
                if(response.status === 200) {
                    const data = await response.json();
                    const user = new User({...data, client: this.client});
                    this.set(user.id, user);
                    resolve(user);
                } else reject();
            }, e => reject(e));
        })
    }
}