const express = require('express');
const app = express();

import { Original } from 'original-sdk';
import { Request, Response } from 'express';
// @ts-ignore
import { CreateTransferRequest } from './types';

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';
const API_SECRET = process.env.API_SECRET || 'YOUR_API_SECRET';

const original = new Original(API_KEY, API_SECRET, { baseURL: process.env.ENDPOINT });

// example of a client transfer endpoint, which would transfer an asset for a user through the original sdk
// request body should contain the following the fields:
// - fromUserUid: the originalUid of the user (client user) which currently owns the asset
// - assetUid: the originalUid of the asset (client asset) to be transferred
// - toAddress: the address of the user (client user) to transfer the asset to
app.post('/transfer', async (req: Request<{}, {}, CreateTransferRequest>, res: Response) => {
  const fromUserUid = req.body.fromUserUid;
  const assetUid = req.body.assetUid;
  const toAddress = req.body.toAddress;
  try {
    const transferResponse = await original.createTransfer({
      asset_uid: assetUid,
      from_user_uid: fromUserUid,
      to_address: toAddress,
    });

    console.log('Transfer Created:', transferResponse.data);
    return res.send(`Transfer Created: ${transferResponse.data}`);
  } catch (error) {
    return res.status(500).send(`Asset Transfer Failed: ${error}`);
  }
});

// example of a client endpoint, which would retrieve a list of transfer from a user
// request body should contain the following the fields:
// - userUid: the originalUid of the user (client user) to retrieve the transfer for
app.get('/transfers', async (req: Request<{}, {}, { userUid: string }>, res: Response) => {
  const userUid = req.body.userUid;

  try {
    const transfers = await original.getTransfersByUserUid(userUid);

    console.log('Transfers Retrieved:', transfers.data);
    return res.send(`Transfers Retrieved: ${transfers.data}`);
  } catch (error) {
    return res.status(500).send(`Transfers Retrieval Failed: ${error}`);
  }
});

// example of a client endpoint, which would retrieve a single transfer by uid
// request should contain the following params:
// - uid: uid of the transfer to get
app.get('/transfer/:uid', async (req: Request<{ uid: string }>, res: Response) => {
  const transferUid = req.params.uid;

  try {
    const transfer = await original.getTransfer(transferUid);

    console.log('Transfer Retrieved:', transfer.data);
    return res.send(`Transfer Retrieved: ${transfer.data}`);
  } catch (error) {
    return res.status(500).send(`Transfer Retrieval Failed: ${error}`);
  }
});

// example of the webhook endpoint, which would be configured in the original dashboard
// configured to only send asset.transferred events
// requests will be sent to the configured endpoint when an asset has completed a transfer on the blockchain
app.post('/webhook/asset-transferred', (req: Request, res: Response) => {
  console.log('Received Asset Transferred event:', req.body);
  // {
  //   "event": "asset.transferred",
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
