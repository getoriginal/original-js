import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  APIErrorResponse,
  APIResponse,
  Asset,
  Burn,
  Collection,
  ErrorFromResponse,
  NewBurn,
  TransferParams,
  UserParams,
  OriginalOptions,
  UidResponse,
  Transfer,
  User,
  Environment,
  AssetParams,
  EditAssetParams,
  Deposit,
} from './types';
import { isErrorResponse } from './error';
import { TokenManager } from './token_manager';

const DEVELOPMENT_URL = 'https://api-dev.getoriginal.com/v1';
const PRODUCTION_URL = 'https://api.getoriginal.com/v1';

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
   * @param {string } [apiKey] - the api key
   * @param {string} [secret] - the api secret
   * @param {OriginalOptions} [options] - additional options, here you can pass custom options to axios instance
   * @example <caption>initialize the client</caption>
   * new OriginalClient('api_key', 'secret')
   */

  constructor(apiKey: string, secret: string, options?: OriginalOptions) {
    if (!apiKey || !secret) {
      throw new Error('apiKey and secret are required');
    }
    this.apiKey = apiKey;
    this.secret = secret;

    this.tokenManager = new TokenManager(this.apiKey, this.secret);
    const configOptions = options ? options : {};

    this.options = {
      withCredentials: false, // making sure cookies are not sent
      ...configOptions,
    };

    this.axiosInstance = axios.create(this.options);

    this.baseURL = this.options.baseURL || this.getEnvURL(this.options.env || Environment.Production);
  }

  getEnvURL(env: string) {
    if (env === Environment.Development) {
      return DEVELOPMENT_URL;
    } else
    if (env === Environment.Production) {
      return PRODUCTION_URL;
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
    err = new ErrorFromResponse(`Original error HTTP code: ${response.status}`);
    if (response.data && response.data.error && response.data.error.detail && response.data.error.type) {
      err = new Error(
        `Original error code ${response.status}: ${response.data.error.type}: ${JSON.stringify(
          response.data.error.detail,
        )}`,
      );
    } else {
      err.response = response;
      err.status = response.status;
    }
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
   * Methods to access the API
   * [Read the Docs](https://docs.getoriginal.com/docs)
   */

  /** User methods */

  /**
   * createUser
   *
   * @param {UserParams} user The details of the user to be created
   * @return {Promise<APIResponse<UidResponse>>} The uid of the created user
   * Will throw an error if the user already exists, or if not all required fields
   * in the UserParams are provided.
   */
  async createUser(user: UserParams) {
    return await this._post<APIResponse<UidResponse>>('user', user);
  }

  /**
   * getUser
   *
   * @param {String} uid Uid of the user to get
   * @return {Promise<APIResponse<User>>} Returns the details of the user.
   * Will throw a 404 error if the user does not exist.
   */
  async getUser(uid: string) {
    return await this._get<APIResponse<User>>(`user/${uid}`);
  }

  /**
   * getUserByEmail
   *
   * @param {String} email Email of the user to get
   * @return {Promise<APIResponse<User | null>>} Returns the details of the user,
   * or null data if not found.
   */
  async getUserByEmail(email: string) {
    return await this._get<APIResponse<User | null>>('user', { email });
  }

  /**
   * getUserByClientId
   *
   * @param {String} clientId ClientId of the user to get
   * @return {Promise<APIResponse<User | null>} Returns the details of the user,
   * or null data if not found.
   */
  async getUserByClientId(clientId: string) {
    return await this._get<APIResponse<User | null>>('user', { client_id: clientId });
  }

  /**
   * collection methods
   */

  /**
   * getCollection
   *
   * @param {String} uid Uid of the collection to get
   * @return {Promise<APIResponse<Collection>>} Returns the details of the collection.
   * Will throw a 404 error if the collection does not exist.
   */
  async getCollection(uid: string) {
    return await this._get<APIResponse<Collection>>(`collection/${uid}`);
  }

  /**
   * asset methods
   */

  /**
   * createAsset
   * @param {AssetParams} asset The details of the asset to be created
   * @return {Promise<APIResponse<UidResponse>>} Returns the uid of the created asset
   * Will throw an error if the asset already exists, or if not all required fields
   * in the NewAsset are provided.
   */
  async createAsset(asset: AssetParams) {
    return await this._post<APIResponse<UidResponse>>('asset', asset);
  }

  /**
   * getAsset
   * @param {string} uid Uid of the asset to get
   * @return {Promise<APIResponse<Asset>>} Returns the details of the asset
   * Will throw a 404 error if the asset does not exist.
   */
  async getAsset(uid: string) {
    return await this._get<APIResponse<Asset>>(`asset/${uid}`);
  }

  /**
   * listAssets
   * @param {string} userUid uid of the owner of the assets to get
   * @return {Promise<APIResponse<Asset[]>>} Returns a list of assets owned by the user, empty if none found.
   */
  async getAssetsByUserUid(userUid: string) {
    return await this._get<APIResponse<Asset[] | null>>('asset', { user_uid: userUid });
  }

  /**
   * editAsset
   * @param {string} uid uid of the asset to edit
   * @param {EditAssetParams} asset The details of the asset to be edited
   * @return {Promise<APIResponse<null>>} Returns success status of the edit
   */
  async editAsset(uid: string, asset: EditAssetParams) {
    return await this._put<APIResponse<null>>(`asset/${uid}`, asset);
  }

  /**
   * transfer methods
   */

  /**
   * createTransfer
   * @param {TransferParams} transfer The details of the transfer to be created
   * @return {Promise<APIResponse<UidResponse>>} Returns the uid of the created transfer
   * Will throw an error if the transfer already exists, or if not all required fields
   */
  async createTransfer(transfer: TransferParams) {
    return await this._post<APIResponse<UidResponse>>('transfer', transfer);
  }

  /**
   * getTransfer
   * @param {string} uid uid of the transfer to get
   * @return {Promise<APIResponse<Transfer>>} Returns the details of the transfer.
   * Will throw a 404 error if the transfer does not exist.
   */
  async getTransfer(uid: string) {
    return await this._get<APIResponse<Transfer>>(`transfer/${uid}`);
  }

  /**
   * listTransfers
   * @param {string} userUid userUid of asset to transfer
   * @return {Promise<APIResponse<Transfer[]>>} Returns a list of transfers made by the user, empty if none found.
   */
  async getTransfersByUserUid(userUid: string) {
    return await this._get<APIResponse<Transfer[] | null>>('transfer', { user_uid: userUid });
  }

  /**
   * burn methods
   */

  /**
   * createBurn
   * @param {NewBurn} burn The details of the burn to be created
   * @return {Promise<APIResponse<UidResponse>>} Uid of the created burn
   */
  async createBurn(burn: NewBurn) {
    return await this._post<APIResponse<UidResponse>>('burn', burn);
  }

  /**
   * getBurn
   * @param {string} uid burn uid to get
   * @return {Promise<APIResponse<Burn>>} Returns details of the burn
   * Will throw a 404 error if the burn does not exist.
   */
  async getBurn(uid: string) {
    return await this._get<APIResponse<Burn>>(`burn/${uid}`);
  }

  /**
   * listBurns
   * @param {string} userUid user_uid of asset to burn
   * @return {Promise<APIResponse<Burn[]>>} Returns a list of burns made by the user, empty if none found
   */
  async getBurnsByUserUid(userUid: string) {
    return await this._get<APIResponse<Burn[] | null>>('burn', { user_uid: userUid });
  }

  /**
   * getDeposit
   * @param {string} userUid user_uid of the user to get deposit details for
   * @return {Promise<APIResponse<Deposit>>} Returns the deposit details of a user
   * Will throw a 404 error if the user does not exist.
   */
  async getDeposit(userUid: string) {
    return await this._get<APIResponse<Deposit>>('deposit', { user_uid: userUid });
  }
}

export const OriginalClient = Original;
