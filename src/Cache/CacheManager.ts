import {Snowflake} from "../Snowflake.ts";
import Client from "../Client.ts";

export default abstract class CacheManager<T> {
    public client: Client;
    public cache: Map<Snowflake, T> = new Map<Snowflake, T>();

    public set(key: Snowflake, value: T): T {
        this.cache.set(key, value);
        return value;
    }

    public get(key: Snowflake): T | undefined {
        return this.cache.get(key);
    }

    constructor(client: Client) {
        this.client = client;
    }

    public abstract fetch(id: Snowflake): Promise<T | undefined>;
}