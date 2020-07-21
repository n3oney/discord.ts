import {Client, Event, event} from "./mod.ts";

let startTime: Date;

class BotClient extends Client {
    @event(Event.Ready)
    setStartTime() {
        startTime = new Date();
    }

    @event(Event.Ready)
    logReady() {
        console.log(`Ready as ${this.user!.username}`);
        console.log(startTime);
    }
}


const client = new BotClient();
await client.login("Njk3NDU3MDkyNTMzMDI2ODg4.XxcLlg.WwNXPKaQPmfQvo-4LHnx99_E5Sk");