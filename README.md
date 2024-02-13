# Official server side JavaScript SDK for [Original](https://getoriginal.com) API

## Table of Contents

- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
  - [Initialization](#initialization)
  - [User](#user)
  - [Asset](#asset)
  - [Collection](#collection)
  - [Transfer](#transfer)
  - [Burn](#burn)
  - [Deposit](#deposit)

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

### User

The user methods exposed by the sdk are used to create and retrieve users from the Original API.

```typescript
// create a new user, by passing in the <UserParams> type
// returns the uid of the newly created user
const newUserUid = await client.createUser({ email: 'YOUR_EMAIL', client_id: 'YOUR_CLIENT_ID' });

// gets a user by uid, will throw a 404 Not Found error if the user does not exist
// returns a <User> type
const user = await client.getUser(newUserUid);

// gets a user by email or client_id
// will return a <User> type if the user exists, otherwise will return null
const userByEmail = await client.getUserByEmail('YOUR_EMAIL');

const userByClientId = await client.getUserByClientId('YOUR_CLIENT_ID');
```

### Asset

The asset methods exposed by the sdk are used to create (mint) assets and retrieve assets from the Original API.

```typescript
// prepare the new asset params following the <AssetParams> type
const newAssetParams =
{
    "user_uid": "324167489835",
    "client_id": "client_id_1",
    "collection_uid": "221137489875",
    "data": {
        "name": "Dave Starbelly",
        "unique_name": true,
        "image_url": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
        "store_image_on_ipfs": true,
        "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
        "external_url": "https://openseacreatures.io/3",
        "attributes": [
            {
                "trait_type": "Base",
                "value": "Starfish"
            },
            {
                "trait_type": "Eyes",
                "value": "Big"
            },
            {
                "trait_type": "Aqua Power",
                "display_type": "boost_number",
                "value": 40
            },
            {
                "trait_type": "Stamina Increase",
                "display_type": "boost_percentage",
                "value": 10
            },
        ]
    }
}

// create a new asset, by passing in the <AssetParams> type
// returns the uid of the newly created asset
const newAssetUid = await client.createAsset(newAssetParams);

// gets an asset by uid, will throw a 404 Not Found error if the asset does not exist
// returns a <Asset> type
const asset = await client.getAsset(newAssetUid);

// gets assets by the owner uid
// will return a list of <Asset>[] owned by the user
const assets = await client.getAssetsByUserUid(newUserUid)

// prepare the edit asset params following the <EditAssetParams> type
const editAssetData =
  {
        "name": "Dave Starbelly Edited",
        "unique_name": true,
        "description": "Friendly OpenSea Creature that enjoys long swims in the ocean. Edited
        "attributes": [
            {
                "trait_type": "Base",
                "value": "Starfish"
            },
        ]
    }

// edits an asset by uid, by passing in the <EditAssetParams> type
// returns success true or false
const editAsset = await client.editAsset(newAssetUid, editAssetData);
```

### Collection

The collection methods exposed by the sdk are used to retrieve collection details from the Original API.

```typescript
// gets a collection by uid, will throw a 404 Not Found error if the collection does not exist
// returns a <Collection> type
const collection = await client.getCollection('221137489875');
```

### Transfer

The transfer methods exposed by the sdk are used to transfer assets from one user to another wallet.

```typescript
// create a transfer of an asset, by passing in the <TransferParams> type
// returns the uid of the newly created transfer
const newTransferUid = await client.createTransfer({
  asset_uid: newAssetUid,
  from_user_uid: newUserUid,
  to_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
});

// gets a transfer by uid, will throw a 404 Not Found error if the transfer does not exist
// returns a <Transfer> type
const transfer = await client.getTransfer(newTransferUid);

// gets transfers by user uid
// will return a list of <Transfer>[] for the asset
const transfers = await client.getTransfersByUserUid(newUserUid);
```

### Burn

The burn methods exposed by the sdk are used to burn assets from a user's wallet.

```typescript
// create a burn of an asset, by passing in the <BurnParams> type
// returns the uid of the newly created burn
const newBurnUid = await client.createBurn({
  asset_uid: newAssetUid,
  user_uid: newUserUid,
});

// gets a burn by uid, will throw a 404 Not Found error if the burn does not exist
// returns a <Burn> type
const burn = await client.getBurn(newBurnUid);

// gets burns by user uid
// will return a list of <Burn>[] for the asset
const burns = await client.getBurnsByUserUid(newUserUid);
```

### Deposit

The deposit methods exposed by the sdk are retrieve the details needed to deposit assets to a user

```typescript
// gets a deposit by uid, will throw a 404 Not Found error if the user does not exist
// returns a <Deposit> type
const deposit = await client.getDeposit(newUserUid);
```
