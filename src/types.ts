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

export type User = {
  created_at: string;
  email: string;
  uid: string;
  wallet_address: string;
  /**
   * @deprecated client_id. Please use `user_external_id` instead.
   */
  client_id?: string;
  user_external_id?: string;
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
  collection_uid: string;
  data: AssetData;
  user_uid: string;
  asset_external_id?: string;
  /**
   * @deprecated client_id. Please use `asset_external_id` instead.
   */
  client_id?: string;
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
  image_url: string;
  name: string;
  org_image_url: string;
  original_id: string;
  attributes?: { trait_type: string; value: string; display_type?: string }[];
  description?: string;
  external_url?: string;
};

export type Asset = {
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
  asset_external_id?: string | null;
  /**
   * @deprecated client_id. Please use `asset_external_id` instead.
   */
  client_id?: string | null;
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
