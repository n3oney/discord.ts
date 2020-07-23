import {Snowflake} from "./Snowflake.ts";

export default class CacheManager<T> {
    public cache: Map<Snowflake, T> = new Map<Snowflake, T>();

    public set(key: Snowflake, value: T): T {
        this.cache.set(key, value);
        return value;
    }

    public get(key: Snowflake): T | undefined {
        return this.cache.get(key);
    }
}