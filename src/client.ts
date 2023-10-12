import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  APIErrorResponse,
  Asset,
  Burn,
  Collection,
  ErrorFromResponse,
  NewAsset,
  NewBurn,
  NewTransfer,
  NewUser,
  OriginalOptions,
  QueryUser,
  Transfer,
  User,
} from './types';
import { isErrorResponse } from './error';
import { TokenManager } from './token_manager';

export class Original {
  private static _instance?: unknown | Original; // type is undefined|StreamChat, unknown is due to TS limitations with statics

  apiKey: string;
  secret: string;
  axiosInstance: AxiosInstance;
  options: OriginalOptions;
  baseURL: string;
  tokenManager: TokenManager;

  /**
   * Initialize a client
   *
   * @param {string } [apiKey] - the api key
   * @param {string} [secret] - the api secret
   * @param {OriginalOptions} [options] - additional options, here you can pass custom options to axios instance
   * @example <caption>initialize the client</caption>
   * new Original('api_key', 'secret')
   */

  constructor(apiKey: string, secret: string, options?: OriginalOptions) {
    this.secret = secret;
    this.apiKey = apiKey;

    this.tokenManager = new TokenManager(this.apiKey, this.secret);
    const configOptions = options ? options : {};

    this.options = {
      timeout: 3000,
      withCredentials: false, // making sure cookies are not sent
      ...configOptions,
    };
    // TODO have some thoughts on moving to fetch instead of axios
    this.axiosInstance = axios.create(this.options);

    this.setBaseURL(this.options.baseURL || this.getEnvURL(this.options.env || 'production'));
  }

  getEnvURL(env: string) {
    if (env === 'acceptance' || env === 'sandbox') {
      return `https://api-${env}.getoriginal.com/api/v1`;
    } else if (env === 'production') {
      return 'https://api.getoriginal.com/api/v1';
    } else {
      throw new Error('Invalid environment');
    }
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  doAxiosRequest = async <T>(
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
      return this.handleResponse(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any /**TODO: generalize error types  */) {
      throw e as AxiosError<APIErrorResponse>;
    }
  };

  _get<T>(url: string, params?: AxiosRequestConfig['params']) {
    return this.doAxiosRequest<T>('get', url, null, { params });
  }

  _post<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('post', url, data);
  }

  _put<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('put', url, data);
  }
  errorFromResponse(response: AxiosResponse<APIErrorResponse>): ErrorFromResponse<APIErrorResponse> {
    let err: ErrorFromResponse<APIErrorResponse>;
    err = new ErrorFromResponse(`GetOriginal error HTTP code: ${response.status}`);
    if (response.data && response.data.code) {
      err = new Error(`GetOriginal error code ${response.data.code}: ${response.data.message}`);
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

  /**
   * sdk-api methods
   */

  // TODO: look at method names, and cross reference with docs
  // TODO: link to the docs for each method

  /**
   * createUser
   *
   * @param {NewUser} user The details of the user to be created
   * @return {Promise<{ data: { uid: string } }>} User post response
   */
  async createUser(user: NewUser) {
    return await this._post<{ uid: string }>('user', user);
  }

  /**
   * getUser
   *
   * @param {String} uid Uid of the user to be queried
   * @return {Promise<UserResponse>} User get response
   */
  async getUser(uid: string) {
    return await this._get<{ user: User }>(`user/${uid}`);
  }

  /**
   * searchUser
   *
   * @param {QueryUser} query either email or clientId to query user
   * @return {Promise<{ user: User }>} User get response
   */
  async queryUser({ email, client_id }: QueryUser) {
    return await this._get('user', { email, client_id });
  }

  /**
   * collection methods
   */

  /**
   * getCollection
   *
   * @param {String} uid either email or clientId to query user
   * @return {Promise<{ collection: Collection }>} Collection get response
   */
  async getCollection(uid: string) {
    return await this._get<{ collection: Collection }>(`collection/${uid}`);
  }

  /**
   * asset endpoint
   */

  /**
   * createAsset
   * @param {NewAsset} asset The details of the asset to be created
   * @return {Promise<{ uid: string }>} Asset post response
   */
  async createAsset(asset: NewAsset) {
    return await this._post<{ asset: Asset }>('asset', asset);
  }

  /**
   * getAsset
   * @param {string} uid either email or clientId to query user
   * @return {Promise<AssetResponse>} Asset get response
   */
  async getAsset(uid: string) {
    return await this._get<{ asset: Asset }>(`asset/${uid}`);
  }

  /**
   * searchAsset
   * @param {string} user_uid either email or clientId to query user
   * @return {Promise<{ uid: string }>} User post response
   */
  async queryAsset({ user_uid }: { user_uid: string }) {
    return await this._get('asset', { user_uid });
  }

  /**
   * createTransfer
   * @param {NewTransfer} transfer The details of the transfer to be created
   * @return {Promise<{ uid: string }>} Transfer post response
   */
  async createTransfer(transfer: NewTransfer) {
    return await this._post<{ uid: string }>('transfer', transfer);
  }

  /**
   * getTransfer
   * @param {string} uid uid of the transfer to get
   * @return {Promise<{ transfer: Transfer }>} Transfer get response
   */
  async getTransfer(uid: string) {
    return await this._get<{ transfer: Transfer }>(`transfer/${uid}`);
  }

  /**
   * searchTransfer
   * @param {string} user_uid user_uid of asset to transfer
   * @return {Promise<{ transfer: Transfer }>} Transfer post response
   */
  async queryTransfer({ user_uid }: { user_uid: string }) {
    return await this._get('transfer', { user_uid });
  }

  /**
   * createBurn
   * @param {NewBurn} burn The details of the burn to be created
   * @return {Promise<{ uid: string }>} Burn post response
   */
  async createBurn(burn: NewBurn) {
    return await this._post<{ uid: string }>('burn', burn);
  }

  /**
   * getBurn
   * @param {string} uid burn uid to get
   * @return {Promise<{ burn: Burn }>} Burn get response
   */
  async getBurn(uid: string) {
    return await this._get<{ burn: Burn }>(`burn/${uid}`);
  }

  /**
   * searchBurn
   * @param {string} user_uid user_uid of asset to burn
   * @return {Promise<{ burn: Burn }>} Burn post response
   */
  async queryBurn({ user_uid }: { user_uid: string }) {
    return await this._get('burn', { user_uid });
  }
}
