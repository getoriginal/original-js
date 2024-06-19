import { AxiosRequestConfig } from 'axios';

export type OriginalOptions = AxiosRequestConfig & {
  env?: Environment;
};

export type UserParams = {
  /**
   * @deprecated client_id. Please use `user_external_id` instead.
   */
  client_id?: string;
  email?: string;
  user_external_id?: string;
};

export type UserWallet = {
  address: string;
  chain_id: number;
  explorer_url: string;
  network: string;
};

export type User = {
  created_at: string;
  email: string;
  uid: string;
  /**
   * @deprecated client_id. Please use `user_external_id` instead.
   */
  client_id?: string;
  user_external_id?: string;
  wallet_address?: string;
  wallets?: UserWallet[];
};

export type Collection = {
  contract_address: string;
  created_at: string;
  description: string;
  explorer_url: string;
  name: string;
  status: string;
  symbol: string;
  type: string;
  uid: string;
};

export type AssetData = {
  image_url: string;
  name: string;
  store_image_on_ipfs: boolean;
  unique_name: boolean;
  attributes?: { trait_type: string; value: string; display_type?: string }[];
  description?: string;
  external_url?: string;
};

export type AssetParams = {
  asset_external_id: string;
  collection_uid: string;
  data: AssetData;
  user_uid: string;
  sale_price_in_usd?: number;
};

export type EditAssetData = {
  image_url: string;
  name: string;
  unique_name: boolean;
  attributes?: { trait_type: string; value: string; display_type?: string }[];
  description?: string;
  external_url?: string;
};

export type EditAssetParams = {
  data: EditAssetData;
};

export type AssetMetadata = {
  image: string;
  name: string;
  org_image_url: string;
  original_id: string;
  attributes?: { trait_type: string; value: string; display_type?: string }[];
  description?: string;
  external_url?: string;
};

export type Asset = {
  asset_external_id: string;
  collection_name: string;
  collection_uid: string;
  created_at: string;
  is_burned: boolean;
  is_editing: boolean;
  is_minted: boolean;
  is_transferable: boolean;
  is_transferring: boolean;
  mint_for_user_uid: string;
  name: string;
  token_id: string;
  uid: string;
  explorer_url?: string;
  metadata?: string | AssetMetadata;
  owner_address?: string;
  owner_user_uid?: string;
  token_uri?: string;
};

export type TransferParams = {
  asset_uid: string;
  from_user_uid: string;
  to_address: string;
};

export type Transfer = {
  asset_uid: string;
  created_at: string;
  from_user_uid: string;
  status: string;
  to_address: string;
  uid: string;
};

export type BurnParams = {
  asset_uid: string;
  from_user_uid: string;
};

export type Burn = {
  asset_uid: string;
  created_at: string;
  from_user_uid: string;
  status: string;
  uid: string;
};

export type Reward = {
  contract_address: string;
  created_at: string;
  description: string;
  explorer_url: string;
  name: string;
  status: string;
  token_name: string;
  token_type: string;
  uid: string;
  withdraw_receiver: string;
};

export type AllocationParams = {
  amount: number;
  nonce: string;
  reward_uid: string;
  to_user_uid: string;
};

export type Allocation = {
  amount: number;
  created_at: string;
  nonce: string;
  reward_uid: string;
  status: string;
  to_user_uid: string;
  uid: string;
};

export type ClaimParams = {
  from_user_uid: string;
  reward_uid: string;
  to_address: string;
};

export type Claim = {
  amount: number;
  created_at: string;
  from_user_uid: string;
  reward_uid: string;
  status: string;
  to_address: string;
  uid: string;
};

export type Deposit = {
  chain_id: number;
  network: string;
  qr_code_data: string;
  wallet_address: string;
};

export type APIResponse<T> = { data: T; success: boolean };
export type UidResponse = { uid: string };

export enum Environment {
  Development = 'development',
  Production = 'production',
}

/**
 * @deprecated use BurnParams instead
 */
export type NewBurn = BurnParams;
