import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  APIResponse,
  Asset,
  Burn,
  Collection,
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
  BurnParams,
} from './types';
import { APIErrorResponse, isErrorResponse, throwErrorFromResponse } from './error';
import { TokenManager } from './token_manager';

const DEVELOPMENT_URL = 'https://api-dev.getoriginal.com/v1';
const PRODUCTION_URL = 'https://api.getoriginal.com/v1';

export class OriginalClient {
  private apiKey: string;
  private secret: string;
  private axiosInstance: AxiosInstance;
  private options: OriginalOptions;
  private baseURL: string;
  private tokenManager: TokenManager;

  /**
   * Initialize a client
   *
   * @param {string } [apiKey] - the api key
   * @param {string} [secret] - the api secret
   * @param {OriginalOptions} [options] - additional options, here you can pass the env and options to axios instance
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

  private getEnvURL(env: string) {
    if (env === Environment.Development) {
      return DEVELOPMENT_URL;
    } else if (env === Environment.Production) {
      return PRODUCTION_URL;
    } else {
      throw new Error('Invalid environment');
    }
  }

  private doAxiosRequest = async <T>(
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

  private _get<T>(url: string, params?: AxiosRequestConfig['params']) {
    return this.doAxiosRequest<T>('get', url, null, { params });
  }

  private _post<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('post', url, data);
  }

  private _put<T>(url: string, data?: unknown) {
    return this.doAxiosRequest<T>('put', url, data);
  }

  private handleResponse<T>(response: AxiosResponse<T>) {
    const data = response.data;
    if (isErrorResponse(response)) {
      throw throwErrorFromResponse(response);
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
   * @param {UserParams} user The details of the user to be created.
   * @return {Promise<APIResponse<UidResponse>>} Returns the response object with the uid of the created user.
   * Will throw an error if the user already exists with the supplied details.
   */
  public async createUser(user?: UserParams) {
    return this._post<APIResponse<UidResponse>>('user', user);
  }

  /**
   * getUser
   *
   * @param {String} uid Uid of the user to get.
   * @return {Promise<APIResponse<User>>} Returns the response object with the details of the user.
   * Will throw a 404 error if the user does not exist.
   */
  public async getUser(uid: string) {
    return this._get<APIResponse<User>>(`user/${uid}`);
  }

  /**
   * getUserByEmail
   *
   * @param {String} email Email of the user to get.
   * @return {Promise<APIResponse<User | null>>} Returns the response object with the details of the user,
   * or null data if not found.
   */
  public async getUserByEmail(email: string) {
    return this._get<APIResponse<User | null>>('user', { email });
  }

  /**
   * @deprecated getUserByClientId. Please use `getUserByUserExternalId` instead.
   * 
   * getUserByClientId
   *
   * @param {String} clientId ClientId of the user to get
   * @return {Promise<APIResponse<User | null>>} Returns the response object with the details of the user,
   * or null data if not found.
   */
  public async getUserByClientId(clientId: string) {
    return this._get<APIResponse<User | null>>('user', { client_id: clientId });
  }

  /**
   * getUserByUserExternalId
   *
   * @param {String} userExternalId UserExternalId of the user to get
   * @return {Promise<APIResponse<User | null>>} Returns the response object with the details of the user,
   * or null data if not found.
   */
  public async getUserByUserExternalId(userExternalId: string) {
    return this._get<APIResponse<User | null>>('user', { user_external_id: userExternalId });
  }

  /**
   * collection methods
   */

  /**
   * getCollection
   *
   * @param {String} uid Uid of the collection to get.
   * @return {Promise<APIResponse<Collection>>} Returns the response object with details of the collection.
   * Will throw a 404 error if the collection does not exist.
   */
  public async getCollection(uid: string) {
    return this._get<APIResponse<Collection>>(`collection/${uid}`);
  }

  /**
   * asset methods
   */

  /**
   * createAsset
   * @param {AssetParams} asset The details of the asset to be created.
   * @return {Promise<APIResponse<UidResponse>>} Returns the response object with the uid of the created asset.
   * Will throw an error if the asset already exists, or if not all required fields.
   * in the AssetParams are provided.
   */
  public async createAsset(asset: AssetParams) {
    return this._post<APIResponse<UidResponse>>('asset', asset);
  }

  /**
   * getAsset
   * @param {string} uid Uid of the asset to get.
   * @return {Promise<APIResponse<Asset>>} Returns the response object with the details of the asset.
   * Will throw a 404 error if the asset does not exist.
   */
  public async getAsset(uid: string) {
    return this._get<APIResponse<Asset>>(`asset/${uid}`);
  }

  /**
   * listAssets
   * @param {string} userUid uid of the owner of the assets to get.
   * @return {Promise<APIResponse<Asset[]>>} Returns the response object with a list of assets owned by the user. Returns an empty list if none found.
   */
  public async getAssetsByUserUid(userUid: string) {
    return this._get<APIResponse<Asset[] | null>>('asset', { user_uid: userUid });
  }

  /**
   * editAsset
   * @param {string} uid uid of the asset to edit.
   * @param {EditAssetParams} asset The details of the asset to be edited.
   * @return {Promise<APIResponse<null>>} Returns the response object with the success status of the edit.
   */
  public async editAsset(uid: string, asset: EditAssetParams) {
    return this._put<APIResponse<null>>(`asset/${uid}`, asset);
  }

  /**
   * transfer methods
   */

  /**
   * createTransfer
   * @param {TransferParams} transfer The details of the transfer to be created.
   * @return {Promise<APIResponse<UidResponse>>} Returns the response object with the uid of the created transfer.
   * Will throw an error if the transfer already exists, or if not all required fields are provided.
   */
  public async createTransfer(transfer: TransferParams) {
    return this._post<APIResponse<UidResponse>>('transfer', transfer);
  }

  /**
   * getTransfer
   * @param {string} uid uid of the transfer to get.
   * @return {Promise<APIResponse<Transfer>>} Returns the response object with the details of the transfer.
   * Will throw a 404 error if the transfer does not exist.
   */
  public async getTransfer(uid: string) {
    return this._get<APIResponse<Transfer>>(`transfer/${uid}`);
  }

  /**
   * listTransfers
   * @param {string} userUid userUid of asset to transfer.
   * @return {Promise<APIResponse<Transfer[]>>} Returns the response object with a list of transfers made by the user. Returns an empty list if none found.
   */
  public async getTransfersByUserUid(userUid: string) {
    return this._get<APIResponse<Transfer[] | null>>('transfer', { user_uid: userUid });
  }

  /**
   * burn methods
   */

  /**
   * createBurn
   * @param {BurnParams} burn The details of the burn to be created.
   * @return {Promise<APIResponse<UidResponse>>} Returns the response object with the uid of the created burn.
   */
  public async createBurn(burn: BurnParams) {
    return await this._post<APIResponse<UidResponse>>('burn', burn);
  }

  /**
   * getBurn
   * @param {string} uid burn uid to get.
   * @return {Promise<APIResponse<Burn>>} Returns the response object with the details of the burn.
   * Will throw a 404 error if the burn does not exist.
   */
  public async getBurn(uid: string) {
    return await this._get<APIResponse<Burn>>(`burn/${uid}`);
  }

  /**
   * listBurns
   * @param {string} userUid user_uid of asset to burn.
   * @return {Promise<APIResponse<Burn[]>>} Returns the response object with a list of burns made by the user. Returns an empty list if none found.
   */
  public async getBurnsByUserUid(userUid: string) {
    return await this._get<APIResponse<Burn[] | null>>('burn', { user_uid: userUid });
  }

  /**
   * getDeposit
   * @param {string} userUid user_uid of the user to get deposit details for.
   * @return {Promise<APIResponse<Deposit>>} Returns the response object with the deposit details of a user.
   * Will throw a 404 error if the user does not exist.
   */
  public async getDeposit(userUid: string) {
    return await this._get<APIResponse<Deposit>>('deposit', { user_uid: userUid });
  }
}

/**
 * @deprecated use OriginalClient instead
 */
export { OriginalClient as Original };
