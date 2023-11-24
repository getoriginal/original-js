// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const app = express();

import dotenv from 'dotenv';

dotenv.config();

import { AssetData, Original } from 'original-sdk';
import { Request, Response } from 'express';
// @ts-ignore
import { EditAssetRequest, MintRequest } from './types';

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';
const API_SECRET = process.env.API_SECRET || 'YOUR_API_SECRET';

console.log('API_KEY', API_KEY);
console.log('API_SECRET', API_SECRET);

const original = new Original(API_KEY, API_SECRET, { baseURL: process.env.ENDPOINT });
// mock user data, this would be stored in a database
const mockClientUserData = {
  '001': {
    id: '001',
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
  '002': {
    id: '002',
    name: 'Jane Doe',
    email: 'janedoes@example.com',
  },
};

const mockClientAssetData: Record<string, { assetData: AssetData; originalUid: string | null }> = {
  '001': {
    assetData: {
      name: 'asset 001',
      unique_name: true,
      image_url: 'https://example.com/image.png',
      store_image_on_ipfs: false,
      description: 'First asset in our client collection',
      attributes: [
        {
          trait_type: 'Eyes',
          value: 'Green',
        },
        {
          trait_type: 'Hair',
          value: 'Black',
        },
      ],
    },
    originalUid: null,
  },
  '002': {
    assetData: {
      name: 'asset 002',
      unique_name: true,
      image_url: 'https://example.com/image-2.png',
      store_image_on_ipfs: false,
      description: 'Second asset in our client collection',
      attributes: [
        {
          trait_type: 'Eyes',
          value: 'Blue',
        },
        {
          trait_type: 'Hair',
          value: 'Brown',
        },
      ],
    },
    originalUid: null,
  },
};

// example of a mint endpoint used by a client, which would mint an asset for a user through the original sdk
// request body should contain the following the fields:
// - userId: the id of the user (client user) to mint the asset for
// - assetId: the data of the asset (client data) to be minted
// - collectionUid: the original uid of the collection to mint from
app.post('/assets/mint', async function (req: Request<{}, {}, MintRequest>, res: Response) {
  const userId = req.body.userId;
  const assetId = req.body.assetId;
  const assetData = mockClientAssetData[assetId];
  const user = mockClientUserData[userId as keyof typeof mockClientUserData];

  if (!assetData) {
    return res.status(404).send('asset data not found');
  }
  if (!user) {
    return res.status(404).send('user not found');
  }

  const originalUser = await original.getUserByEmail(user.email);

  if (!originalUser.data) {
    return res.status(404).send('original user not found');
  }

  try {
    const asset = await original.createAsset({
      client_id: originalUser.data.client_id,
      collection_uid: req.body.collectionUid,
      data: assetData.assetData,
      user_uid: originalUser.data.uid,
    });
    // here we would store the uid of the asset in our database (ex. original_uid: asset.data.uid)
    mockClientAssetData[assetId].originalUid = asset.data.uid;

    console.log('Asset Minted:', asset.data);
    return res.send(`Asset Minted: ${asset.data}`);
  } catch (error) {
    return res.status(500).send(`Asset Minting Failed: ${error}`);
  }
});

// example of an edit asset endpoint used by a client, which would edit an asset for a user through the original sdk
// request body should contain the following the fields:
// - assetId: the id of the asset (client asset) to edit
// - assetData: the new asset data of the asset (client data) to be edited
app.post('/assets/edit', async function (req: Request<{}, {}, EditAssetRequest>, res: Response) {
  const assetId = req.body.assetId;
  const editedAssetData = req.body.editedAssetData;
  const asset = mockClientAssetData[assetId];

  if (!asset) {
    return res.status(404).send('asset not found');
  }

  if (!asset.originalUid) {
    return res.status(404).send('asset not not minted, or does not have originalUid');
  }

  try {
    const editedAsset = await original.editAsset(asset.originalUid, { data: editedAssetData });

    console.log('Asset Edited:', editedAsset.data);
    return res.send(`Asset Edited: ${editedAsset.data}`);
  } catch {
    return res.status(500).send(`Asset Editing Failed`);
  }
});

// example of getting a list all the asset a user owns through the original sdk
// request body should contain the following the fields:
// - userOriginalUid: the id of the user (client user) to get the asset for
app.get('/assets', async function (req: Request<{}, {}, { userOriginalUid: string }>, res: Response) {
  const userOriginalUid = req.body.userOriginalUid;

  try {
    const assets = await original.getAssetsByUserUid(userOriginalUid);

    console.log('Assets Retrieved:', assets.data);
    return res.send(`Assets Retrieved: ${assets.data}`);
  } catch (error) {
    return res.status(500).send(`Asset Retrieval Failed: ${error}`);
  }
});

// example of an endpoint used for retrieving data for a single asset
// request should contain the following params:
// - uid: the originalUid of the asset to retrieve
app.get('/assets/:uid', async function (req: Request<{ uid: string }>, res: Response) {
  const assetOriginalUid = req.params.uid;

  try {
    const asset = await original.getAsset(assetOriginalUid);

    console.log('Asset Retrieved:', asset.data);
    res.send(`Asset Retrieved: ${asset.data}`);
  } catch (error) {
    res.status(500).send(`Asset Retrieval Failed: ${error}`);
  }
});

// example of the webhook endpoint, which would be configured in the original dashboard
// configured to only send asset.minted events
// requests will be sent to the configured endpoint when an asset has completed minting on the blockchain
app.post('/webhook/asset-minted', (req: Request, res: Response) => {
  console.log('Received Asset Minted event:', req.body);
  // {
  //   "event": "asset.minted",
  //   "data": {
  //       "asset": { uid...
  //    }
  // }
  // See full example of asset events here: https://docs.getoriginal.com/docs/webhooks-configuration#asset-events
  res.status(200).send('OK');
});

// example of the webhook endpoint, which would be configured in the original dashboard
// configured to only send asset.edited events
// requests will be sent to the configured endpoint when an edit asset transaction has completed and the edited data is on the blockchain
app.post('/webhook/asset-edited', (req: Request, res: Response) => {
  console.log('Received Asset Edited` event:', req.body);
  // {
  //   "event": "asset.edited",
  //   "data": {
  //       "asset": { uid...
  //    }
  // }
  // See full example of asset events here: https://docs.getoriginal.com/docs/webhooks-configuration#asset-events
  res.status(200).send('OK');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
