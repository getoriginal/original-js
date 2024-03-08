# Official server side JavaScript SDK for [Original](https://getoriginal.com) API

## Table of Contents

- [Getting Started](#✨-getting-started)
- [Documentation](#📚-documentation)
  - [Initialization](#initialization)
  - [User](#user)
    - [Create a new user](#create-a-new-user)
    - [Get a user by UID](#get-a-user-by-uid)
    - [Get a user by email](#get-a-user-by-email)
    - [Get a user by client ID](#get-a-user-by-client-id)
  - [Asset](#asset)
    - [Create a new asset](#create-a-new-asset)
    - [Get an asset by UID](#get-an-asset-by-asset-uid)
    - [Get assets by user UID](#get-assets-by-user-uid)
    - [Edit an asset](#edit-an-asset)
  - [Transfer](#transfer)
    - [Create a new transfer](#create-a-new-transfer)
    - [Get a transfer by transfer UID](#get-a-transfer-by-transfer-uid)
    - [Get transfers by user UID](#get-transfers-by-user-uid)
  - [Burn](#burn)
    - [Create a new burn](#create-a-new-burn)
    - [Get a burn by burn UID](#get-a-burn-by-burn-uid)
    - [Get burns by user UID](#get-burns-by-user-uid)
  - [Deposit](#deposit)
    - [Get deposit details for a user](#get-deposit-details-by-user-uid)
  - [Collection](#collection)
    - [Get a collection by UID](#get-a-collection-by-collection-uid)
  - [Handling Errors](#handling-errors)

## ✨ Getting started

Ensure you have registered for an account at [Original](https://app.getoriginal.com) before getting started.
You will need to create an app and note down your API key and secret from the [API Keys page](https://docs.getoriginal.com/docs/create-your-api-key) to use the Original SDK.

Install Original using [`npm`](https://www.npmjs.com/package/jest):

```bash
npm install original-sdk
```

or with [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add original-sdk
```

## 📚 Documentation

### Initialization

The Original SDK is set up to expose and type all values returned from the Original API.

Read the full [Original API documentation](https://docs.getoriginal.com).

Import the sdk using commonjs or es6 imports.

```typescript
import { OriginalClient } from 'original-sdk';
// or
const { OriginalClient } = require('original-sdk');
```

Create a new instance of the Original client by passing in your api key and secret with
the environment associated with that app.

### Development

For development apps, you must pass the environment:

```typescript
import { OriginalClient, Environment } from 'original-sdk';

const client = new OriginalClient('YOUR_DEV_APP_API_KEY', 'YOUR_DEV_APP_SECRET', { env: Environment.Development });
```

### Production

For production apps, you can optionally pass the production environment:

```typescript
import { OriginalClient, Environment } from 'original-sdk';

const client = new OriginalClient('YOUR_PROD_APP_API_KEY', 'YOUR_PROD_APP_SECRET', { env: Environment.Production });
```

or omit the environment, which will default to production:

```typescript
import { OriginalClient } from 'original-sdk';

const client = new OriginalClient('YOUR_PROD_APP_API_KEY', 'YOUR_PROD_APP_SECRET');
```

## User

The user methods exposed by the sdk are used to create and retrieve users from the Original API.

### Create a new user

```typescript
// Returns a response object. Access the user's UID through the `data` attribute.
const response = await client.createUser();
const userUid = response.data.uid;
// Sample response
{
    success: true,
    data: {
        uid: "175324281338"
    }
}

// You can also pass in a client_id and/or email for your external reference.
// The client ID and/or email supplied must be unique per app
const response = await client.createUser({ client_id: 'YOUR_CLIENT_ID', email: 'YOUR_EMAIL' });
const userUid = response.data.uid;
// ...
```

### Get a user by UID

```typescript
// Get a user by UID
// Returns their details in a response object if the user exists. If not, a 404 client error will be thrown.
const response = await client.getUser(userUid);
const userDetails = response.data;
// Sample response
{
    success: true,
    data: {
        uid: "754566475542",
        client_id: "user_client_id",
        created_at: "2024-02-26T13:12:31.798296Z",
        email: "user_email@email.com",
        wallet_address: "0xa22f2dfe189ed3d16bb5bda5e5763b2919058e40"
    }
}
```

### Get a user by email

```typescript
// Get a user by email
// Attempts to retrieve a user by their email address. If the user does not exist, `data` will be null.
const response = await client.getUserByEmail('YOUR_EMAIL');
const userDetails = response.data;
// Sample response on success
{
    success: true,
    data: {
        uid: "754566475542",
        client_id: "user_client_id",
        created_at: "2024-02-26T13:12:31.798296Z",
        email: "user_email@email.com",
        wallet_address: "0xa22f2dfe189ed3d16bb5bda5e5763b2919058e40"
    }
}

// Sample response (if user does not exist) on failure
{
    success: false,
    data: null
}
```

### Get a user by client ID

```typescript
// Get a user by client ID
// Retrieves a user by their client ID. If the user does not exist, `data` will be null.
const response = await client.getUserByClientId('YOUR_CLIENT_ID');
const userByClientId = response.data;
// Sample response on success
{
    success: true,
    data: {
        uid: "754566475542",
        client_id: "user_client_id",
        created_at: "2024-02-26T13:12:31.798296Z",
        email: "user_email@email.com",
        wallet_address: "0xa22f2dfe189ed3d16bb5bda5e5763b2919058e40"
    }
}
// Sample response on failure:
{
    success: false,
    data: null
}
```

## Asset

The asset methods exposed by the sdk are used to create (mint) assets and retrieve assets from the Original API.

### Create a new asset

```typescript
// prepare the new asset params following the <AssetParams> type
const newAssetParams: AssetParams =
{
    user_uid: "324167489835",
    client_id: "client_id_1",
    collection_uid: "221137489875",
    data: {
        name: "Dave Starbelly",
        unique_name: true,
        image_url: "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
        store_image_on_ipfs: true,
        description: "Friendly OpenSea Creature that enjoys long swims in the ocean.",
        external_url: "https://openseacreatures.io/3",
        attributes: [
            {
                trait_type: "Base",
                value: "Starfish"
            },
            {
                trait_type: "Eyes",
                value: "Big"
            },
            {
                trait_type: "Aqua Power",
                display_type: "boost_number",
                value: 40
            },
            {
                trait_type: "Stamina Increase",
                display_type: "boost_percentage",
                value: 10
            },
        ]
    }
}

// create a new asset, by passing in the params
// returns the uid of the newly created asset
const response = await client.createAsset(newAssetParams);
const assetUid = response.data.uid;
// Sample response
{
    success: true,
    data: {
        uid: "151854912345"
    }
}
```

### Get an asset by asset UID

```typescript
// gets an asset by uid, will throw a 404 Not Found error if the asset does not exist
// returns a <Asset> type
const response = await client.getAsset(assetUid);
const asset = response.data;
// Sample response
{
    success: true,
    data: {
        uid: "151854912345",
        name: "random name #2",
        client_id: "asset_client_id_1",
        collection_uid: "471616646163",
        collection_name: "Test SDK Collection 1",
        token_id: 2,
        created_at: "2024-02-16T11:33:19.577827Z",
        is_minted: true,
        is_burned: false,
        is_transferring: false,
        is_transferable: true,
        is_editing: false,
        mint_for_user_uid: "885810911461",
        owner_user_uid: "885810911461",
        owner_address: "0x32e28bfe647939d073d39113c697a11e3065ea97",
        metadata: {
            name: "random name",
            image_url: "https://cryptopunks.app/cryptopunks/cryptopunk1081.png",
            description: "nft_description",
            original_id: "151854912345",
            external_url: "external_url@example.com",
            org_image_url: "https://cryptopunks.app/cryptopunks/cryptopunk1081.png",
            attributes: [
                {
                    trait_type: "Stamina Increase",
                    display_type: "boost_percentage",
                    value: 10
                }
            ]
        },
        explorer_url: "https://mumbai.polygonscan.com/token/0x124a6755ee787153bb6228463d5dc3a02890a7db?a=2",
        token_uri: "https://storage.googleapis.com/{...}.json"
    }
}
```

### Get assets by user UID

```typescript
// Get assets by the user's UID
// will return a list of <Asset>[] owned by the user
const response = await client.getAssetsByUserUid(userUid)
const assetList = response.data;
// Sample response (showing one asset for brevity, wrapped in a response object):
{
    success: true,
    data: [
        {
            uid: "151854912345",
            name: "random name #2",
            client_id: "asset_client_id_1",
            collection_uid: "471616646163",
            collection_name: "Test SDK Collection 1",
            token_id: 2,
            created_at: "2024-02-16T11:33:19.577827Z",
            is_minted: true,
            is_burned: false,
            is_transferring: false,
            is_transferable: true,
            is_editing: false,
            mint_for_user_uid: "885810911461",
            owner_user_uid: "885810911461",
            owner_address: "0x32e28bfe647939d073d39113c697a11e3065ea97",
            metadata: {
                name: "random name",
                image_url: "https://cryptopunks.app/cryptopunks/cryptopunk1081.png",
                description: "nft_description",
                original_id: "151854912345",
                external_url: "external_url@example.com",
                org_image_url: "https://cryptopunks.app/cryptopunks/cryptopunk1081.png",
                attributes: [
                    {
                        trait_type: "Stamina Increase",
                        display_type: "boost_percentage",
                        value: 10
                    }
                ]
            },
            explorer_url: "https://mumbai.polygonscan.com/token/0x124a6755ee787153bb6228463d5dc3a02890a7db?a=2",
            token_uri: "https://storage.googleapis.com/original-production-media/data/metadata/9ac0dad4-75ae-4406-94fd-1a0f6bf75db3.json"
        }
        // Additional assets would be represented with similar structure here
    ]
}
```

### Edit an asset

NOTE: Editing an asset will overwrite the existing asset data with the new data provided.
If you want to maintain any of the existing data, you must include it in the new data below.

NOTE: You must include all the required fields. See https://docs.getoriginal.com/docs/edit-asset for more information.

```typescript
// prepare the edit asset params following the <EditAssetParams> type
const editAssetData: EditAssetParams = {
    name: "Dave Starbelly Edited",
    unique_name: true,
    description: "Friendly OpenSea Creature that enjoys long swims in the ocean. Edited",
    attributes: [
        {
            trait_type: "Base",
            value: "Starfish"
        },
    ]
    // If you want to keep any existing asset data, include it below...
}

// edits an asset by uid, by passing in the <EditAssetParams> type
// returns success true or false
const response = await client.editAsset(assetUid, editAssetData);
const editSuccess = response.success
// Sample response:
{
    success: true,
    data: null
}
```

## Transfer

The transfer methods exposed by the sdk are used to transfer assets from one user to another wallet.

### Create a new transfer

```typescript
// create a transfer of an asset, by passing in the <TransferParams> type
// returns the uid of the newly created transfer
const transferParams: TransferParams = {
  asset_uid: assetUid,
  from_user_uid: userUid,
  to_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
}
const response = await client.createTransfer(transferParams);

const transferUid = response.data.uid;
// Sample response:
{
    success: true,
    data: {
        uid: "883072660397"
    }
}
```

### Get a transfer by transfer UID

```typescript
// gets a transfer by uid, will throw a 404 Not Found error if the transfer does not exist
// returns a <Transfer> type
const response = await client.getTransfer(transferUid);
const transferDetails = response.data;
// Sample response:
{
    success: true,
    data: {
        uid: "883072660397",
        status: "done",
        asset_uid: "708469717542",
        from_user_uid: "149997600351",
        to_address: "0xe02522d0ac9f53e35a56f42cd5e54fc7b5a12f05",
        created_at: "2024-02-26T10:20:17.668254Z"
    }
}
```

### Get transfers by user UID

```typescript
// gets a list of transfers by user uid
// will return a list of <Transfer>[] for the asset
const response = await client.getTransfersByUserUid(userUid);
transfersList = response.data;
// Sample response:
{
    success: true,
    data: [
        {
            uid: "883072660397",
            status: "done",
            asset_uid: "708469717542",
            from_user_uid: "149997600351",
            to_address: "0xe02522d0ac9f53e35a56f42cd5e54fc7b5a12f05",
            created_at: "2024-02-26T10:20:17.668254Z"
        }
        // Additional transfers would be represented with similar structure here
    ]
}
```

## Burn

The burn methods exposed by the sdk are used to burn assets from a user's wallet.

### Create a new burn

```typescript
// create a burn of an asset, by passing in the <BurnParams> type
// returns the uid of the newly created burn
const burnParams: BurnParams = {
  asset_uid: assetUid,
  from_user_uid: userUid,
}
const response = await client.createBurn(burnParams);

const burnUid = response.data.uid
// Sample response:
{
    success: true,
    data: {
        uid: "365684656925",
    }
}
```

### Get a burn by burn UID

```typescript

// gets a burn by uid, will throw a 404 Not Found error if the burn does not exist
// returns a <Burn> type
const response = await client.getBurn(burnUid);
burnDetails = response.data;
// Sample response:
{
    success: true,
    data: {
        uid: "365684656925",
        status: "done",
        asset_uid: "708469717542",
        from_user_uid: "483581848722",
        created_at: "2024-02-26T10:20:17.668254Z"
    }
}
```

### Get burns by user UID

```typescript
// gets burns by user uid
// will return a list of <Burn>[] for the asset
const response = await client.getBurnsByUserUid(userUid);
const burnsList = response.data;
// Sample response:
{
    success: true,
    data: [
        {
            uid: "365684656925",
            status: "done",
            asset_uid: "708469717542",
            from_user_uid: "483581848722",
            created_at: "2024-02-26T10:22:47.848973Z"
        }
        // Additional burns would be represented with similar structure here
    ]
}
```

## Deposit

The deposit methods exposed by the sdk are retrieve the details needed to deposit assets to a user

### Get deposit details by user UID

```typescript
// gets a deposit by uid, will throw a 404 Not Found error if the user does not exist
// returns a <Deposit> type
const response = await client.getDeposit(userUid);
depositDetails = response.data;
// Sample response:
{
    success: true,
    data: {
        network: "Mumbai",
        chain_id: 80001,
        wallet_address: "0x1d6169328e0a2e0a0709115d1860c682cf8d1398",
        qr_code_data: "ethereum:0x1d6169328e0a2e0a0709115d1860c682cf8d1398@80001"
    }
}
```

## Collection

The collection methods exposed by the sdk are used to retrieve collection details from the Original API.

### Get a collection by collection UID

```typescript
// gets a collection by uid, will throw a 404 Not Found error if the collection does not exist
// returns a <Collection> type
const response = await client.getCollection(collectionUid);
const collectionDetails = response.data;
// Sample response
{
    success: true,
    data: {
        uid: "221137489875",
        name: "Test SDK Collection 1",
        status: "deployed",
        type: "ERC721",
        created_at: "2024-02-13T10:45:56.952745Z",
        editable_assets: true,
        contract_address: "0x124a6755ee787153bb6228463d5dc3a02890a7db",
        symbol: "SYM",
        description: "Description of the collection",
        explorer_url: "https://mumbai.polygonscan.com/address/0x124a6755ee787153bb6228463d5dc3a02890a7db"
    }
}
```

### Handling Errors

If something goes wrong, you will receive well typed error messages.

```typescript
export class ClientError extends OriginalError { ... }
export class ServerError extends OriginalError { ... }
export class ValidationError extends OriginalError { ... }
```

All errors inherit from an `OriginalError` class where you can access the standard properties from the `Error` class as well as the following:

```typescript
export enum OriginalErrorCode {
  clientError = 'client_error',
  serverError = 'server_error',
  validationError = 'validation_error',
}

export class OriginalError extends Error {
  status: number;
  data: APIErrorResponse | string;
  code: OriginalErrorCode;
  // ...
}
```

So when an error occurs, you can either catch all using the OriginalError class:

```typescript
import { OriginalError } from 'original-sdk';

try {
  client.createUser('client_id', 'invalid_email');
} catch (error: unknown) {
  if (error instanceof OriginalError) {
    // handle all errors
  }
}
```

or specific errors:

```typescript
import { ClientError, ServerError, ValidationError } from 'original-sdk';

try {
  client.createUser('client_id', 'invalid_email');
} catch (error: unknown) {
  if (error instanceof ClientError) {
    // handle client errors
  } else if (error instanceof ServerError) {
    // handle server errors
  } else if (error instanceof ValidationError) {
    // handle validation errors
  }
}
```

If the error comes from our server, you will receive an error in this structure:

```json
{
  "status": 400,
  "data": {
    "success": false,
    "error": {
      "type": "validation_error",
      "detail": {
        "code": "invalid",
        "message": "Enter a valid email address.",
        "field_name": "email"
      }
    }
  },
  "code": "validation_error"
}
```

Otherwise if it comes from the client, you will receive error in this format:

```json
{
  "status": 404,
  "data": "Not Found",
  "code": "client_error"
}
```
