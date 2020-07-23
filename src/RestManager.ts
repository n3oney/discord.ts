export default class RestManager {
    public token: string;
    private base = "https://discord.com/api/v6";

    public get(path: string, body: any = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            fetch(this.base + path, {
                method: "GET",
                body: JSON.stringify(body),
                headers: {
                    Authorization: this.token,
                    "Content-Type": "application/json",
                    ...headers
                }
            }).then(async res => {
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    public patch(path: string, body: any = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            fetch(this.base + path, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: {
                    Authorization: this.token,
                    "Content-Type": "application/json",
                    ...headers
                }
            }).then(async res => {
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    constructor(token: string) {
        this.token = token;
    }
}