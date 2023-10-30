# Official server side JavaScript sdk for [Original](https://getoriginal.com) API

## 📝 About Original

You can request access for an Original account at our [Request Access](https://getoriginal.com/contact-us/) page.

## ⚙️ Installation

### NPM

```bash
npm install original-sdk
```

### Yarn

```bash
yarn add original-sdk
```

## ✨ Getting started

The Original SDK is set up to expose and type the all values returned from the Original API.

```typescript
const Original = require('original-js');
//or
import Original from 'original-js';

// create a new instance of the Original client
const client = new Original('YOUR_API_KEY', 'API_KEY_SECRET');

// create a new user, by passing in the <UserParams> type
// returns the uid of the newly created user
const newUserUid = await client.createUser({ email: 'YOUR_EMAIL', client_id: 'YOUR_CLIENT_ID' });

// gets a user by uid, will throw a 404 Not Found error if the user does not exist
// returns a <User> type
const user = await client.getUser(newUserUid);

// gets a user by email
const searchedUser = await client.getUserByEmail({ email: 'YOUR_EMAIL' });
```

## 🔗 (Optional) Development Setup in Combination with our SDK

### Connect to [Original SDK](https://github.com/GetOriginal/original-js)

Run this in project root

```shell
yarn link
```

Run this in your local project

```shell
yarn link original-sdk
yarn dev
```
