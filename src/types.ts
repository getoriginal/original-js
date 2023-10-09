import {Axios, AxiosRequestConfig, AxiosResponse} from "axios";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys]

export enum Environment {
    Acceptance = 'acceptance',
    Production = 'production',
    Sandbox = 'sandbox'
}

export type OriginalOptions = AxiosRequestConfig & {
    browser?: boolean;
    env?: Environment;
}

type ErrorResponseDetails = {
    code: number;
    messages: string[];
};

export type APIErrorResponse = {
    code: number;
    duration: string;
    message: string;
    more_info: string;
    StatusCode: number;
    details?: ErrorResponseDetails;
};

export class ErrorFromResponse<T> extends Error {
    code?: number;
    response?: AxiosResponse<T>;
    status?: number;
}

export type Endpoint = 'user' | 'collection' | 'asset' | 'transfer' | 'burn'


export type NewUser = { email: string, clientId: string}

export type User = {uid: string, client_id: string, created_at: Date, email: string, wallet_address: string}

export type QueryUser = RequireAtLeastOne<{ email?: string, clientId?: string }, 'email' | 'clientId'>