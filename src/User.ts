import Client from "./Client.ts";

export interface UserOptions {
    username: string;
    id: string;
    discriminator: string;
    bot?: boolean;
    avatar: string;
    client: Client;
}

export default class User {
    public username: string;
    public id: string;
    public discriminator: string;
    public bot: boolean;
    public avatar: string;
    public client: Client;

    public fetch(): Promise<User> {
        return new Promise(async (resolve, reject) => {
            this.client.restManager.get("/users/" + this.id).then(async response => {
                if(response.status === 200) {
                    const data = await response.json();
                    this.id = data.id;
                    this.username = data.username;
                    this.avatar = data.avatar;
                    this.discriminator = data.discriminator;
                    resolve(this);
                } else reject();
            }, e => reject(e));
        })
    }

    constructor(options: UserOptions) {
        this.username = options.username;
        this.id = options.id;
        this.discriminator = options.discriminator;
        this.bot = !!options.bot;
        this.avatar = options.avatar;
        this.client = options.client;
    }
}