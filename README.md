# Official server side JavaScript sdk for [Original](https://getoriginal.com) API

## 📝 About Original

You can requst access for an Original account at our [Request Access](https://getoriginal.com/contact-us/) page.

## ⚙️ Installation

### NPM

```bash
npm install original-api
```

### Yarn

```bash
yarn add original-api
```

### JS deliver

```html
<script src="https://cdn.jsdelivr.net/npm/original-api"></script>
```

## ✨ Getting started

The Original SDK is set up to expose and type the all values returned from our API.
```typescript
const Original = require('original-api');

const client = new Original('YOUR_API_KEY', 'API_KEY_SECRET');

// create a new user
const newUserUid = await client.createUser({email: 'YOUR_EMAIL', client_id: 'YOUR_CLIENT_ID',})

// get user
const user = await client.getUser(newUserUid);

// search users
const queriedUser = await client.queryUser({email: 'YOUR_EMAIL'});

```
## 🔗 (Optional) Development Setup in Combination with our SDK

### Connect to [Original SDK](https://github.com/GetOriginal/original-js)
 
Run this in project root
```shell
yarn link
```

Run this in your local project
```shell
yarn link original
yarn dev
```