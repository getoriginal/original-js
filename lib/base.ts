import fetch, { RequestInit } from "node-fetch";
// TODO this is temporary, final version will have a generic HTTPRequest argument, supplied by the caller.
//  This is what stripe does and is more generic.

type Config = {
    apiKey: string;
    secret: string;
    baseUrl?: string; // This probably wont be a param in the final version, as we will only point to our own endpoints.
}


export abstract class Base {
    private apiKey: string;
    private secret: string;
    private baseUrl: string;
    constructor(config: Config) {
        this.apiKey = config.apiKey;
        this.secret = config.secret;
        this.baseUrl = config.baseUrl || 'example url';
    }

    protected invoke<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const endpointUrl = `${this.baseUrl}/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'Authorization': `Bearer ${this.secret}`
        }
        const config = {
            ...options,
            headers,
        }
        return fetch(endpointUrl, config).then((response): Promise<any> => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        });
    }
}