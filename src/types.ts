import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type OriginalOptions = AxiosRequestConfig & {
  env?: Environment;
};

type ErrorResponseDetails = {
  code: number;
  messages: string[];
};

export type APIErrorResponse = {
  code: number;
  duration: string;
  message: string;
  more_info: string;
  statusCode: number;
  details?: ErrorResponseDetails;
};

export class ErrorFromResponse<T> extends Error {
  code?: number;
  response?: AxiosResponse<T>;
  status?: number;
}

export type UserParams = { client_id: string; email: string };

export type User = { client_id: string; created_at: string; email: string; uid: string; wallet_address: string };

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
  client_id: string;
  collection_uid: string;
  data: AssetData;
  user_uid: string;
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

export type Asset = {
  client_id: string;
  collection_name: string;
  collection_uid: string;
  created_at: string;
  is_burned: boolean;
  is_minted: boolean;
  is_transferable: boolean;
  is_transferring: boolean;
  mint_for_user_uid: string;
  name: string;
  token_id: string;
  uid: string;
  explorer_url?: string;
  metadata?: string;
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

export type NewBurn = {
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

export type APIResponse<T> = { data: T; success: boolean };
export type UidResponse = { uid: string };

export enum Environment {
  Production = 'production',
}
