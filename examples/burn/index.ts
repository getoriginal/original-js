// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const app = express();

import dotenv from 'dotenv';

dotenv.config();

import { Original } from 'original-sdk';
import { Request, Response } from 'express';
// @ts-ignore
import { CreateBurnRequest } from './types';

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';
const API_SECRET = process.env.API_SECRET || 'YOUR_API_SECRET';

const original = new Original(API_KEY, API_SECRET, { baseURL: process.env.ENDPOINT });

// example of a burn endpoint used by a client, which would burn an asset through the original sdk
// request body should contain the following the fields:
// - assetUid: the uid of the asset to burn
// - fromUserUid: the uid of the user to burn the asset for
app.post('/burn/mint', async function (req: Request<{}, {}, CreateBurnRequest>, res: Response) {
  const assetUid = req.body.assetUid;
  const userUid = req.body.fromUserUid;

  try {
    const burnResponse = await original.createBurn({ asset_uid: assetUid, from_user_uid: userUid });

    console.log('Asset Burned:', burnResponse.data);
    return res.send(`Asset Burned: ${burnResponse.data}`);
  } catch (error) {
    return res.status(500).send(`Asset Burn Failed: ${error}`);
  }
});

// example of getting a list all the asset a user has burned through the original sdk
// request body should contain the following the fields:
// - userUid: the id of the user (client user) to get the asset for
app.get('/burns', async function (req: Request<{}, {}, { userUid: string }>, res: Response) {
  const userUid = req.body.userUid;

  try {
    const burns = await original.getBurnsByUserUid(userUid);

    console.log('Burns Retrieved:', burns.data);
    return res.send(`Burns Retrieved: ${burns.data}`);
  } catch (error) {
    return res.status(500).send(`Burn Retrieval Failed: ${error}`);
  }
});

// example of getting a single burn by uid through the original sdk
// request should contain the following params:
// - uid: the uid of the burn to get
app.get('/burn/:uid', async function (req: Request<{ uid: string }>, res: Response) {
  const burnUid = req.params.uid;

  try {
    const burn = await original.getBurn(burnUid);

    console.log('Burn Retrieved:', burn.data);
    return res.send(`Burn Retrieved: ${burn.data}`);
  } catch (error) {
    return res.status(500).send(`Burn Retrieval Failed: ${error}`);
  }
});

// example of the webhook endpoint, which would be configured in the original dashboard
// configured to only send asset.burned events
// requests will be sent to the configured endpoint when an asset has been burned on the blockchain
app.post('/webhook/asset-burned', (req: Request, res: Response) => {
  console.log('Received Asset Transferred event:', req.body);
  // {
  //   "event": "asset.burned",
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
