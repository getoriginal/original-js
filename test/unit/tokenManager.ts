import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { TokenManager } from '../../src';

describe('TokenManager', () => {
  const apiKey = 'testApiKey';
  const secret = 'testSecret';

  it('initializes and generates a token correctly', () => {
    const tokenManager = new TokenManager(apiKey, secret);
    expect(tokenManager).to.have.property('token').that.is.a('string');

    const decoded = jwt.verify(tokenManager.getToken(), secret);
    expect(decoded).to.include({
      resource: '*',
      action: '*',
      user_id: '*',
      api_key: apiKey,
    });
  });

  it('returns the same token for subsequent calls', () => {
    const tokenManager = new TokenManager(apiKey, secret);
    const firstToken = tokenManager.getToken();
    const secondToken = tokenManager.getToken();

    expect(firstToken).to.equal(secondToken);
  });

  it('throws an error if apiKey is not provided', () => {
    expect(() => new TokenManager('', secret)).to.throw();
  });

  it('throws an error if secret is not provided', () => {
    expect(() => new TokenManager(apiKey, '')).to.throw();
  });

  it('generates a token with the correct options', () => {
    const tokenManager = new TokenManager(apiKey, secret);
    const token = tokenManager.getToken();
    const decoded = jwt.decode(token, { complete: true });

    expect(decoded).to.have.property('header').that.includes({ alg: 'HS256' });
    expect(decoded).to.have.property('payload').that.does.not.have.property('iat');
  });
});
