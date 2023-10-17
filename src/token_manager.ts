import jwt, { SignOptions } from 'jsonwebtoken';

export function JWTServerToken(apiKey: string, apiSecret: string) {
  const payload = { resource: '*', action: '*', user_id: '*', api_key: apiKey };

  const opts: SignOptions = Object.assign({ algorithm: 'HS256', noTimestamp: true });
  return jwt.sign(payload, apiSecret, opts);
}

export class TokenManager {
  secret: string;
  apiKey: string;
  token: string;
  constructor(apiKey: string, secret: string) {
    this.secret = secret;
    this.apiKey = apiKey;
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
