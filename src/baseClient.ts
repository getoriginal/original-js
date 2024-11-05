import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIErrorResponse, isErrorResponse, throwErrorFromResponse } from './error';
import { TokenManager } from './tokenManager';

const DEVELOPMENT_URL = 'https://api-dev.getoriginal.com/v1';
const PRODUCTION_URL = 'https://api.getoriginal.com/v1';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export type OriginalOptions = AxiosRequestConfig & {
  env?: Environment;
};

export class BaseClient {
  protected apiKey: string;
  protected secret: string;
  protected axiosInstance: AxiosInstance;
  protected options: OriginalOptions;
  protected baseURL: string;
  protected tokenManager: TokenManager;

  /**
   * Initialize a client
   *
   * @param {string } [apiKey] - the api key
   * @param {string} [secret] - the api secret
   * @param {OriginalOptions} [options] - additional options, here you can pass the env and options to axios instance
   * @example <caption>initialize the client</caption>
   * new OriginalClient('api_key', 'secret')
   */

  constructor(apiKey?: string, secret?: string, options?: OriginalOptions) {
    apiKey = apiKey || process.env.ORIGINAL_API_KEY;
    secret = secret || process.env.ORIGINAL_API_SECRET;

    if (!apiKey || !secret) {
      throw new Error('apiKey and secret are required');
    }
    this.apiKey = apiKey;
    this.secret = secret;

    this.tokenManager = new TokenManager(this.apiKey, this.secret);
    const configOptions = options ? options : {};

    this.options = {
      withCredentials: false,
      ...configOptions,
    };

    this.axiosInstance = axios.create(this.options);

    this.baseURL = this.getBaseURL();
  }

  protected getBaseURL() {
    if (this.options.baseURL) {
      return this.options.baseURL;
    } else if (process.env.ORIGINAL_BASE_URL) {
      return process.env.ORIGINAL_BASE_URL;
    } else if (
      this.options.env === Environment.Development ||
      process.env.ORIGINAL_ENVIRONMENT === Environment.Development
    ) {
      return DEVELOPMENT_URL;
    } else {
      return PRODUCTION_URL;
    }
  }

  protected doAxiosRequest = async <T>(
    type: string,
    endpoint: string,
    data?: unknown,
    options: AxiosRequestConfig & {
      config?: AxiosRequestConfig & { maxBodyLength?: number };
    } = {},
  ): Promise<T> => {
    const url = `${this.baseURL}/${endpoint}`;
    const token = this.tokenManager.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'X-API-KEY': this.apiKey,
      Authorization: `Bearer ${token}`,
    };

    const requestConfig = {
      ...options,
      headers,
    };
    try {
      let response: AxiosResponse<T>;
      try {
        switch (type) {
          case 'get':
            response = await this.axiosInstance.get(url, requestConfig);
            break;
          case 'post':
            response = await this.axiosInstance.post(url, data, requestConfig);
            break;
          case 'put':
            response = await this.axiosInstance.put(url, data, requestConfig);
            break;
          default:
            throw new Error('Invalid request type');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        return this.handleResponse(e.response);
      }
      return this.handleResponse(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any /**TODO: generalize error types  */) {
      throw e as AxiosError<APIErrorResponse>;
    }
  };

  protected _get<T>(url: string, params?: AxiosRequestConfig['params']) {
    return this.doAxiosRequest<T>('get', url, null, { params });
  }

  protected _post<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('post', url, data);
  }

  protected _put<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('put', url, data);
  }

  protected handleResponse<T>(response: AxiosResponse<T>) {
    const data = response.data;
    if (isErrorResponse(response)) {
      throw throwErrorFromResponse(response);
    }
    return data;
  }
}
