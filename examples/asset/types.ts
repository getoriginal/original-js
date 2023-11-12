import { AssetData } from 'original-sdk';

export type MintRequest = {
  userId: string;
  assetId: string;
  collectionUid: string;
};

export type EditAssetRequest = {
  assetId: string;
  editedAssetData: AssetData;
};

export type TransferRequest = {
  userId: string;
  assetId: string;
  toUserId: string;
};

export type MockUser = {
  id: string;
  name: string;
  email: string;
};
