export type AssetAttribute = {
  trait_type: string;
  value: string;
  display_type?: string;
};

export type AssetData = {
  image_url: string;
  name: string;
  store_image_on_ipfs: boolean;
  unique_name: boolean;
  attributes?: AssetAttribute[];
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

export type AssetMetadata = {
  image: string;
  name: string;
  org_image_url: string;
  original_id: string;
  attributes?: AssetAttribute[];
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
  mint_for_address: string;
  mint_for_user_uid: string;
  name: string;
  token_id: string;
  uid: string;
  explorer_url?: string;
  metadata?: AssetMetadata;
  owner_address?: string;
  owner_user_uid?: string;
  sale_price_in_usd?: number;
  token_address?: string;
  token_uri?: string;
};
