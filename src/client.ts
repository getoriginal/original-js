import {
  APIResponse,
  Asset,
  Burn,
  Collection,
  TransferParams,
  UserParams,
  UidResponse,
  Transfer,
  User,
  AssetParams,
  EditAssetParams,
  Deposit,
  BurnParams,
  AllocationParams,
  Allocation,
  ClaimParams,
  Claim,
  Reward,
  Balance,
} from './types';
import { BaseClient } from './baseClient';

export class OriginalClient extends BaseClient {
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
  public async createUser(user?: UserParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('user', user);
  }

  /**
   * getUser
   *
   * @param {String} uid Uid of the user to get.
   * @return {Promise<APIResponse<User>>} Returns the response object with the details of the user.
   * Will throw a 404 error if the user does not exist.
   */
  public async getUser(uid: string): Promise<APIResponse<User>> {
    return this._get<APIResponse<User>>(`user/${uid}`);
  }

  /**
   * getUserByEmail
   *
   * @param {String} email Email of the user to get.
   * @return {Promise<APIResponse<User | null>>} Returns the response object with the details of the user,
   * or null data if not found.
   */
  public async getUserByEmail(email: string): Promise<APIResponse<User | null>> {
    return this._get<APIResponse<User | null>>('user', { email });
  }

  /**
   * getUserByUserExternalId
   *
   * @param {String} userExternalId UserExternalId of the user to get
   * @return {Promise<APIResponse<User | null>>} Returns the response object with the details of the user,
   * or null data if not found.
   */
  public async getUserByUserExternalId(userExternalId: string): Promise<APIResponse<User | null>> {
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
  public async getCollection(uid: string): Promise<APIResponse<Collection>> {
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
  public async createAsset(asset: AssetParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('asset', asset);
  }

  /**
   * getAsset
   * @param {string} uid Uid of the asset to get.
   * @return {Promise<APIResponse<Asset>>} Returns the response object with the details of the asset.
   * Will throw a 404 error if the asset does not exist.
   */
  public async getAsset(uid: string): Promise<APIResponse<Asset>> {
    return this._get<APIResponse<Asset>>(`asset/${uid}`);
  }

  /**
   * listAssets
   * @param {string} userUid uid of the owner of the assets to get.
   * @return {Promise<APIResponse<Asset[]>>} Returns the response object with a list of assets owned by the user. Returns an empty list if none found.
   */
  public async getAssetsByUserUid(userUid: string): Promise<APIResponse<Asset[]>> {
    return this._get<APIResponse<Asset[]>>('asset', { user_uid: userUid });
  }

  /**
   * editAsset
   * @param {string} uid uid of the asset to edit.
   * @param {EditAssetParams} asset The details of the asset to be edited.
   * @return {Promise<APIResponse<null>>} Returns the response object with the success status of the edit.
   */
  public async editAsset(uid: string, asset: EditAssetParams): Promise<APIResponse<null>> {
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
  public async createTransfer(transfer: TransferParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('transfer', transfer);
  }

  /**
   * getTransfer
   * @param {string} uid uid of the transfer to get.
   * @return {Promise<APIResponse<Transfer>>} Returns the response object with the details of the transfer.
   * Will throw a 404 error if the transfer does not exist.
   */
  public async getTransfer(uid: string): Promise<APIResponse<Transfer>> {
    return this._get<APIResponse<Transfer>>(`transfer/${uid}`);
  }

  /**
   * listTransfers
   * @param {string} userUid userUid of asset to transfer.
   * @return {Promise<APIResponse<Transfer[]>>} Returns the response object with a list of transfers made by the user. Returns an empty list if none found.
   */
  public async getTransfersByUserUid(userUid: string): Promise<APIResponse<Transfer[]>> {
    return this._get<APIResponse<Transfer[]>>('transfer', { user_uid: userUid });
  }

  /**
   * burn methods
   */

  /**
   * createBurn
   * @param {BurnParams} burn The details of the burn to be created.
   * @return {Promise<APIResponse<UidResponse>>} Returns the response object with the uid of the created burn.
   */
  public async createBurn(burn: BurnParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('burn', burn);
  }

  /**
   * getBurn
   * @param {string} uid burn uid to get.
   * @return {Promise<APIResponse<Burn>>} Returns the response object with the details of the burn.
   * Will throw a 404 error if the burn does not exist.
   */
  public async getBurn(uid: string): Promise<APIResponse<Burn>> {
    return this._get<APIResponse<Burn>>(`burn/${uid}`);
  }

  /**
   * listBurns
   * @param {string} userUid user_uid of asset to burn.
   * @return {Promise<APIResponse<Burn[]>>} Returns the response object with a list of burns made by the user. Returns an empty list if none found.
   */
  public async getBurnsByUserUid(userUid: string): Promise<APIResponse<Burn[]>> {
    return this._get<APIResponse<Burn[]>>('burn', { user_uid: userUid });
  }

  /**
   * getDeposit
   * @param {string} userUid user_uid of the user to get deposit details for.
   * @param {string} collectionUid collection_uid of the collection to get deposit details for, optional
   * @return {Promise<APIResponse<Deposit>>} Returns the response object with the deposit details of a user.
   * Will throw a 404 error if the user does not exist.
   */
  public async getDeposit(userUid: string, collectionUid: string): Promise<APIResponse<Deposit>> {
    return this._get<APIResponse<Deposit>>('deposit', { user_uid: userUid, collection_uid: collectionUid });
  }

  /**
   * reward methods
   */

  /**
   * getReward
   *
   * @param {String} uid Uid of the reward to get
   * @return {Promise<APIResponse<Reward>>} Returns the details of the reward.
   * Will throw a 404 error if the reward does not exist.
   */
  public async getReward(uid: string): Promise<APIResponse<Reward>> {
    return this._get<APIResponse<Reward>>(`reward/${uid}`);
  }

  /**
   * allocation methods
   */

  /**
   * createAllocation
   * @param {AllocationParams} allocation The details of the allocation to be created
   * @return {Promise<APIResponse<UidResponse>>} Uid of the created allocation
   */
  public async createAllocation(allocation: AllocationParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('reward/allocate', allocation);
  }

  /**
   * getAllocation
   * @param {string} uid allocation uid to get
   * @return {Promise<APIResponse<Allocation>>} Returns details of the allocation
   * Will throw a 404 error if the allocation does not exist.
   */
  public async getAllocation(uid: string): Promise<APIResponse<Allocation>> {
    return this._get<APIResponse<Allocation>>(`reward/allocate/${uid}`);
  }

  /**
   * listAllocations
   * @param {string} userUid user_uid of allocations
   * @return {Promise<APIResponse<Allocation[]>>} Returns a list of allocations available to the user, empty if none found
   */
  public async getAllocationsByUserUid(userUid: string): Promise<APIResponse<Allocation[]>> {
    return this._get<APIResponse<Allocation[]>>('reward/allocate', { user_uid: userUid });
  }

  /**
   * claim methods
   */

  /**
   * createClaim
   * @param {ClaimParams} claim The details of the claim to be created
   * @return {Promise<APIResponse<UidResponse>>} Uid of the created allocation
   */
  public async createClaim(claim: ClaimParams): Promise<APIResponse<UidResponse>> {
    return this._post<APIResponse<UidResponse>>('reward/claim', claim);
  }

  /**
   * getClaim
   * @param {string} uid claim uid to get
   * @return {Promise<APIResponse<Claim>>} Returns details of the allocation
   * Will throw a 404 error if the allocation does not exist.
   */
  public async getClaim(uid: string): Promise<APIResponse<Claim>> {
    return this._get<APIResponse<Claim>>(`reward/claim/${uid}`);
  }

  /**
   * listClaims
   * @param {string} userUid user_uid of claims
   * @return {Promise<APIResponse<Claim[]>>} Returns a list of claims available to the user, empty if none found
   */
  public async getClaimsByUserUid(userUid: string): Promise<APIResponse<Claim[]>> {
    return this._get<APIResponse<Claim[]>>('reward/claim', { user_uid: userUid });
  }

  /**
   * balance
   * @param {string} rewardUid reward_uid of the reward to get balance for
   * @param {string} userUid user_uid of the user to get balance for
   * @return {Promise<APIResponse<number>>} Returns the balance of the user for the reward
   */
  public async getBalance(rewardUid: string, userUid: string): Promise<APIResponse<Balance>> {
    return this._get<APIResponse<Balance>>('reward/balance', { reward_uid: rewardUid, user_uid: userUid });
  }
}
