import jwt, { SignOptions } from 'jsonwebtoken';

export function JWTServerToken(apiSecret: string) {
  const payload = {
    server: true,
  };

  const opts: SignOptions = Object.assign({ algorithm: 'HS256', noTimestamp: true });
  return jwt.sign(payload, apiSecret, opts);
}

export class TokenManager {
  secret: string;
  token: string;
  constructor(secret: string) {
    this.secret = secret;
    this.token = JWTServerToken(this.secret);
  }

  getToken = () => {
    if (this.token) {
      return this.token;
    }

    if (this.secret) {
      return JWTServerToken(this.secret);
    }

    throw new Error(
      `Both secret and user tokens are not set. Either client.connectUser wasn't called or client.disconnect was called`,
    );
  };
}
