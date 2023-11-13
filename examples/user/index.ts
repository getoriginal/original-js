const express = require('express');
const app = express();

import { Request, Response } from 'express';
import { Original } from 'original-sdk';
// @ts-ignore
import { CreateUserRequest } from './types';

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';
const API_SECRET = process.env.API_SECRET || 'YOUR_API_SECRET';

const original = new Original(API_KEY, API_SECRET, { baseURL: process.env.ENDPOINT });

// mock user data, this would be stored in a database
const mockClientUserData: Record<string, { id: string; name: string; email: string; originalUid: string | null }> = {
  '001': {
    id: '001',
    name: 'John Doe',
    email: 'johndoe@example.com',
    originalUid: null,
  },
  '002': {
    id: '002',
    name: 'Jane Doe',
    email: 'janedoes@example.com',
    originalUid: null,
  },
};

// example of a client endpoint, which would create an original user for a client user
app.post('/user/link-original', async function (req: Request<{}, {}, { id: string }>, res: Response) {
  const id = req.body.id;
  const user = mockClientUserData[id as keyof typeof mockClientUserData];

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
    const originalResponse = await original.createUser({ email: user.email, client_id: user.id });
    // update the user in the database with the original user id
    user.originalUid = originalResponse.data.uid;

    console.log('Original User Created:', originalResponse.data);
    return res.send(`Original User Created: ${originalResponse.data}`);
  } catch (error) {
    return res.status(500).send(`Original User Creation Failed: ${error}`);
  }
});

// example of a client endpoint, which would get a user and also retrieve the original user if it exists
app.get('/user/:id', async function (req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const user: any = mockClientUserData[id];
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

// example of a client endpoint which would create a new user, both in the clients 'database' and in Original
app.post('/user', async function (req: Request<{}, {}, CreateUserRequest>, res: Response) {
  const email = req.body.email;
  const client_id = req.body.clientId;

  try {
    const originalResponse = await original.createUser({ email, client_id });
    const user = { email, name: req.body.name, originalUid: originalResponse.data.uid, id: originalResponse.data.uid };
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
