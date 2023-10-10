import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  APIErrorResponse,
  Asset,
  Burn,
  Collection,
  Endpoint,
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
  apiKey: string;
  secret: string;
  axiosInstance: AxiosInstance;
  options: OriginalOptions;
  baseURL: string;
  tokenManager: TokenManager;

  /**
   * Initialize a client
   *
   * @param apiKey
   * @param {string} [secret] - the api secret
   * @param {OriginalOptions} [options] - additional options, here you can pass custom options to axios instance
   * @example <caption>initialize the client</caption>
   * new Original('api_key', 'secret')
   */

  constructor(apiKey: string, secret: string, options?: OriginalOptions) {
    this.secret = secret;
    this.apiKey = apiKey;

    this.tokenManager = new TokenManager(this.secret);
    const configOptions = options ? options : {};

    this.options = {
      timeout: 3000,
      withCredentials: false, // making sure cookies are not sent
      ...configOptions,
    };

    this.axiosInstance = axios.create(this.options);

    const envURL =
      this.options.env !== undefined
        ? `https://api-${this.options.env}.getoriginal.com/api/v1`
        : 'https://api.getoriginal.com/api/v1';

    this.setBaseURL(this.options.baseURL || envURL);
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
    const token = this.tokenManager.getToken();
    console.log('token', token);
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
        default:
          throw new Error('Invalid request type');
      }
      return this.handleResponse(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any /**TODO: generalize error types  */) {
      throw e as AxiosError<APIErrorResponse>;
    }
  };

  _get<T>(url: Endpoint, params?: AxiosRequestConfig['params']) {
    return this.doAxiosRequest<T>('get', url, null, { params });
  }

  _post<T>(url: Endpoint, data?: unknown) {
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

  /**
   * user methods
   */

  /**
   * createUser
   *
   * @param {NewUser} user The details of the user to be created
   * @return {Promise<{ uid: string }>} User post response
   */
  async createUser(user: NewUser) {
    return await this._post<{ uid: string }>('user', user);
  }

  /**
   * getUser
   *
   * @param {String} uid Uid of the user to be queried
   * @return {Promise<{ user: User }>} User get response
   */
  async getUser(uid: string) {
    return await this._get<{ user: User }>('user', { uid: uid });
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
    return await this._get<{ collection: Collection }>('collection', { uid });
  }

  /**
   * asset endpoint
   */

  /**
   * createAsset
   * @param {NewAsset} asset The details of the asset to be created
   */
  async createAsset(asset: NewAsset) {
    return await this._post<{ asset: Asset }>('asset', asset);
  }

  /**
   * getAsset
   * @param {String} uid either email or clientId to query user
   * @return {Promise<{ asset: Asset }>} Asset get response
   */
  async getAsset(uid: string) {
    return await this._get<{ asset: Asset }>('asset', { uid });
  }

  /**
   * searchAsset
   * @param {string} user_uid either email or clientId to query user
   * @return {Promise<{ asset: Asset }>} User post response
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
   * @param {String} uid uid of the transfer to get
   * @return {Promise<{ transfer: Transfer }>} Transfer get response
   */
  async getTransfer(uid: string) {
    return await this._get<{ transfer: Transfer }>('transfer', { uid });
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
   * @param {String} uid burn uid to get
   * @return {Promise<{ burn: Burn }>} Burn get response
   */
  async getBurn(uid: string) {
    return await this._get<{ burn: Burn }>('burn', { uid });
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
