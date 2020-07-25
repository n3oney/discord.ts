import Client from "./Client.ts";

export default class RestManager {
    private base = "https://discord.com/api/v6";
    private _responseListeners: Array<(msg: Response) => any> = [];

    public client: Client;

    public onResponse(callback: (msg: Response) => any) {
        this._responseListeners.push(callback);
    }

    public get(path: string, body: {[key: string]: string | boolean | null | number} = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            if(!this.client.token) return reject(new Error("Client isn't connected."));

            const url = new URL(this.base + path);
            for(let a of Object.entries(body)) {
                url.searchParams.append(a[0], String(a[1]));
            }

            fetch(url, {
                method: "GET",
                headers: {
                    Authorization: this.client.token,
                    ...headers
                }
            }).then(async res => {
                this._responseListeners.forEach(r => r(res));
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    public patch(path: string, body: any = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            if(!this.client.token) return reject(new Error("Client isn't connected."));
            fetch(this.base + path, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: {
                    Authorization: this.client.token,
                    "Content-Type": "application/json",
                    ...headers
                }
            }).then(async res => {
                this._responseListeners.forEach(r => r(res));
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    public put(path: string, body: any = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            if(!this.client.token) return reject(new Error("Client isn't connected."));
            fetch(this.base + path, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    Authorization: this.client.token,
                    "Content-Type": "application/json",
                    ...headers
                }
            }).then(async res => {
                this._responseListeners.forEach(r => r(res));
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    public delete(path: string, body: any = {}, headers: any = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            if(!this.client.token) return reject(new Error("Client isn't connected."));
            fetch(this.base + path, {
                method: "DELETE",
                body: JSON.stringify(body),
                headers: {
                    Authorization: this.client.token,
                    "Content-Type": "application/json",
                    ...headers
                }
            }).then(async res => {
                this._responseListeners.forEach(r => r(res));
                resolve(res);
            }, e => {
                reject(e);
            })
        });
    }

    constructor(client: Client) {
        this.client = client;
    }
}