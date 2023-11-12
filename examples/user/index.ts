const express = require('express');
const app = express();

import { Request } from 'express';
import { Original } from 'original-sdk';
import { CreateUserRequest } from './types';

const original = new Original(process.env.API_KEY, process.env.API_SECRET, { baseURL: process.env.ENDPOINT });
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

// example of a client endpoint, which would create an original user for a client user
app.post('/user/link-original', async function (req: Request<{}, {}, { id: string }>, res) {
  const id = req.body.id;
  const user = mockClientUserData[id];

  if (!user) {
    res.status(404).send('user not found');
  }
  // check the user doesn't already have an original user
  const originalUser = await original.getUserByEmail(user.email);

  if (originalUser) {
    res.status(400).send('user already has an original user');
  }

  try {
    // create the original user
    const originalResponse = await original.createUser({ email: user.email, client_id: user.client_id });
    // update the user in the database with the original user id
    user.original_uid = originalResponse.data.uid;

    console.log('Original User Created:', originalResponse.data);
    return res.send(`Original User Created: ${originalResponse.data}`);
  } catch (error) {
    return res.status(500).send(`Original User Creation Failed: ${error}`);
  }
});

// example of a client endpoint, which would get a user and also retrieve the original user if it exists
app.get('/user/:id', async function (req: Request<{ id: string }>, res) {
  const id = req.params.id;
  const user = mockClientUserData[id];
  if (!user) {
    res.status(404).send('user not found');
  }
  try {
    // get the original user, if it exists, add it to the user object
    const originalUser = await original.getUserByEmail(user.email);
    if (originalUser.data) {
      user.original_user = originalUser.data;
    }

    console.log('User Retrieved:', user);
    return res.send(`User Retrieved: ${user}`);
  } catch (error) {
    return res.send(`User Retrieval Failed: ${error}`);
  }
});

// example of a client endpoint which would create a new user
app.post('/user', async function (req: Request<{}, {}, CreateUserRequest>, res) {
  const email = req.body.email;
  const client_id = req.body.clientId;

  try {
    const originalResponse = await original.createUser({ email, client_id });
    const user = { email, client_id, original_uid: originalResponse.data.uid };
    // this would save the user to the client database
    mockClientUserData[originalResponse.data.uid] = user;

    console.log('User Created:', user);
    return res.send(`User Created: ${user}`);
  } catch (error) {
    res.status(500).send(`User Creation Failed: ${error}`);
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
