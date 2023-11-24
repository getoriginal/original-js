import { AssetData } from 'original-sdk';

export type MintRequest = {
  assetId: string;
  collectionUid: string;
  userId: string;
};

export type EditAssetRequest = {
  assetId: string;
  editedAssetData: AssetData;
};
