import Client from "./Client.ts";

export enum Event {
    Message = "onMessage",
    Ready = "onReady",
    Raw = "onRaw",
    GuildCreate = "onGuildCreate",
    Http = "onHttp"
}

export const defaultEventValues = {
    [Event.Message]: [],
    [Event.Raw]: [],
    [Event.Ready]: [],
    [Event.GuildCreate]: [],
    [Event.Http]: []
};

export function event(event: Event) {
    return function (target: Client, propertyKey: string, descriptor: PropertyDescriptor) {
        let value: { [key in Event]: Function[] } = defaultEventValues;

        const getter = function () {
            return value;
        };

        const setter = function (newVal: { [key in Event]: Function[] }) {
            value = newVal;
        };

        if (typeof target.eventHandlers === "undefined")
            Object.defineProperty(target, "eventHandlers", {
                get: getter,
                set: setter
            });

        target.eventHandlers[event].push(descriptor.value);
    };
}