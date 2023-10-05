import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {APIErrorResponse, Endpoint, ErrorFromResponse, OriginalOptions} from "./types";
import {isErrorResponse} from "./error";

export class Original{
    browser: boolean;
    node: boolean;
    apiKey:string;
    secret: string;
    axiosInstance: AxiosInstance;
    options: OriginalOptions;
    baseURL: string;

    /**
     * Initialize a client
     *
     * **Only use constructor for advanced usages. It is strongly advised to use `Original.getInstance()` instead of
     * `new Original()` to reduce integration issues**
     * ^ this above code is from getStream. I think it is not an issue for us as we don't use websockets, so we have no
     * concern over creating multiple websockets.
     * @param {string} key - the api key
     * @param {string} [secret] - the api secret
     * @param {StreamChatOptions} [options] - additional options, here you can pass custom options to axios instance
     * @param {boolean} [options.browser] - enforce the client to be in browser mode
     * @param {httpsAgent} [options.httpsAgent] - custom httpsAgent, in node it's default to https.agent()
     * @example <caption>initialize the client</caption>
     * new StreamChat('api_key', 'secret')
     */

    constructor(apiKey: string, secret: string, options?: OriginalOptions) {
        this.secret = secret;
        this.apiKey = apiKey;

        const configOptions = options ? options : {}

        this.browser = typeof configOptions.browser !== 'undefined' ? configOptions.browser : typeof window !== undefined
        this.node = !this.browser

        this.options = {
            timeout: 3000,
            withCredentials: false, // making sure cookies are not sent
            ...configOptions,
        };

        this.axiosInstance = axios.create(this.options);

        this.setBaseURL(this.options.baseURL || 'https://api-acceptance.getoriginal.com/api/vi')

    }

    setBaseURL(baseURL: string) {
        this.baseURL = baseURL;
    }

    doAxiosRequest = async <T>(
        type: string,
        endpoint: Endpoint,
        data?: unknown,
        options: AxiosRequestConfig & {
            config?: AxiosRequestConfig & { maxBodyLength?: number };
        } = {},
    ): Promise<T> => {
        const url = `${this.baseURL}/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'Authorization': `Bearer ${this.secret}`
        }

        const requestConfig = {
            ...options,
            headers,
        };
        try {
            let response: AxiosResponse<T>;
            switch (type) {
                case 'get':
                    response = await this.axiosInstance.get(url, requestConfig);
                    break;
                case 'post':
                    response = await this.axiosInstance.post(url, data, requestConfig);
                    break;
                default:
                    throw new Error('Invalid request type');
            }
            return this.handleResponse(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any /**TODO: generalize error types  */) {
                throw e as AxiosError<APIErrorResponse>;
        }
    };

    get<T>(url: Endpoint, params?: AxiosRequestConfig['params']) {
        return this.doAxiosRequest<T>('get', url, null, { params });
    }

    post<T>(url: Endpoint, data?: unknown) {
        return this.doAxiosRequest<T>('post', url, data);
    }

    errorFromResponse(response: AxiosResponse<APIErrorResponse>): ErrorFromResponse<APIErrorResponse> {
        let err: ErrorFromResponse<APIErrorResponse>;
        err = new ErrorFromResponse(`StreamChat error HTTP code: ${response.status}`);
        if (response.data && response.data.code) {
            err = new Error(`StreamChat error code ${response.data.code}: ${response.data.message}`);
            err.code = response.data.code;
        }
        err.response = response;
        err.status = response.status;
        return err;
    }

    handleResponse<T>(response: AxiosResponse<T>) {
        const data = response.data;
        if (isErrorResponse(response)) {
            throw this.errorFromResponse(response);
        }
        return data;
    }
}