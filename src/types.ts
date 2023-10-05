import {Axios, AxiosRequestConfig, AxiosResponse} from "axios";

export type RequireAtLeastOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];


export type OriginalOptions = AxiosRequestConfig & {
    browser?: boolean;
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