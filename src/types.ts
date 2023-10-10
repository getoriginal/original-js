import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type OriginalOptions = AxiosRequestConfig & {
  baseUrl?: boolean;
  env?: 'acceptance' | 'production' | 'sandbox';
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
  StatusCode: number;
  details?: ErrorResponseDetails;
};

export class ErrorFromResponse<T> extends Error {
  code?: number;
  response?: AxiosResponse<T>;
  status?: number;
}

export type Endpoint = 'user' | 'collection' | 'asset' | 'transfer' | 'burn';

export type NewUser = { client_id: string; email: string };

export type User = { client_id: string; created_at: Date; email: string; uid: string; wallet_address: string };

export type QueryUser = RequireAtLeastOne<{ client_id?: string; email?: string }, 'email' | 'client_id'>;

export type Collection = {
  contract_address: string;
  created_at: Date;
  description: string;
  explorer_url: string;
  // eslint-disable-next-line typescript-sort-keys/interface
  name: string;
  status: string;
  // eslint-disable-next-line typescript-sort-keys/interface
  symbol: string;
  type: string;
  uid: string;
};

export type NewAssetData = {
  attributes: string;
  description: string;
  external_url: string;
  image_url: string;
  name: string;
  // eslint-disable-next-line typescript-sort-keys/interface
  store_image_on_ipfs: boolean;
  unique_name: string;
};

export type NewAsset = {
  client_id: string;
  collection_uid: string;
  data: NewAssetData;
  user_uid: string;
};

export type Asset = {
  client_id: string;
  collection_name: string;
  // eslint-disable-next-line typescript-sort-keys/interface
  collection_uid: string;
  created_at: Date;
  explorer_url: string | null;
  // eslint-disable-next-line typescript-sort-keys/interface
  is_burned: boolean;
  // eslint-disable-next-line typescript-sort-keys/interface
  is_minted: boolean;
  is_transferable: boolean;
  is_transferring: boolean;
  metadata: string | null;
  mint_for_user_uid: string;
  name: string;
  owner_address: string | null;
  owner_user_uid: string | null;
  token_id: string;
  token_uri: string | null;
  uid: string;
};

export type NewTransfer = {
  asset_uid: string;
  from_user_uid: string;
  to_user_uid: string;
};

export type Transfer = {
  asset_uid: string;
  // eslint-disable-next-line typescript-sort-keys/interface
  created_at: Date;
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
  created_at: Date;
  from_user_uid: string;
  status: string;
  uid: string;
};
