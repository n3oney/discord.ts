export interface UserOptions {
    username: string;
    id: string;
    discriminator: string;
    bot: boolean;
    avatar: string;
}

export default class User {
    public username: string;
    public id: string;
    public discriminator: string;
    public bot: boolean;
    public avatar: string;

    constructor(options: UserOptions) {
        this.username = options.username;
        this.id = options.id;
        this.discriminator = options.discriminator;
        this.bot = options.bot;
        this.avatar = options.avatar;
    }
}