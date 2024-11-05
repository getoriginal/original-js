import { AssetAttribute } from './asset';

export type EditAssetData = {
  image_url: string;
  name: string;
  unique_name: boolean;
  attributes?: AssetAttribute[];
  description?: string;
  external_url?: string;
};

export type EditAssetParams = {
  data: EditAssetData;
};
