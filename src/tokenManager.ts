import jwt, { SignOptions } from 'jsonwebtoken';

export function JWTServerToken(apiKey: string, secret: string) {
  const payload = { resource: '*', action: '*', user_id: '*', api_key: apiKey };

  const opts: SignOptions = Object.assign({ algorithm: 'HS256', noTimestamp: true });
  return jwt.sign(payload, secret, opts);
}

export class TokenManager {
  apiKey: string;
  secret: string;
  token: string;

  constructor(apiKey: string, secret: string) {
    this.apiKey = apiKey;
    this.secret = secret;

    if (!apiKey || !secret) {
      throw new Error(`Either apiKey or secret is not set. Please set the apiKey and secret in the constructor`);
    }
    this.token = JWTServerToken(this.apiKey, this.secret);
  }

  getToken = () => {
    if (this.token) {
      return this.token;
    }

    if (this.secret) {
      return JWTServerToken(this.apiKey, this.secret);
    }

    throw new Error(`Either token or secret is not set. Please set the secret in the constructor`);
  };
}
