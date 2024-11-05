import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import axios from 'axios';
import { verify } from 'jsonwebtoken';
import { ClientError, ServerError, throwErrorFromResponse } from '../../src';
import { BaseClient, OriginalOptions, Environment } from '../../src/baseClient';

export class MockClient extends BaseClient {
  constructor(apiKey: string, secret: string, options?: OriginalOptions) {
    super(apiKey, secret, options);
  }

  public async createUser(userData: { user_external_id: string; email: string }) {
    return this._post('user', userData);
  }
}

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Base client initialization and configuration tests', () => {
  let axiosCreateStub: sinon.SinonStub;

  beforeEach(() => {
    axiosCreateStub = sinon.stub(axios, 'create').returns({
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
    } as any);
  });

  afterEach(() => {
    axiosCreateStub.restore();
  });

  it('sets the correct baseURL based on configuration', () => {
    const client = new MockClient('apiKey', 'apiSecret', { baseURL: 'http://localhost:3004' });

    const expectedURL = 'http://localhost:3004/user/create';
    (axiosCreateStub().post as sinon.SinonStub).withArgs(expectedURL).resolves({});

    client.createUser({ user_external_id: 'user_external_id', email: 'test@test.com' });
    expect((axiosCreateStub().post as sinon.SinonStub).calledWith(expectedURL)).to.be.true;
  });

  it('sets baseURL according to the environment, development', () => {
    const client = new MockClient('apiKey', 'apiSecret', { env: Environment.Development });

    const expectedURL = 'https://api-dev.getoriginal.com/v1/user/create';
    (axiosCreateStub().post as sinon.SinonStub).withArgs(expectedURL).resolves({});

    client.createUser({ user_external_id: 'user_external_id', email: 'test@test.com' });
    expect((axiosCreateStub().post as sinon.SinonStub).calledWith(expectedURL)).to.be.true;
  });

  it('sets baseURL according to the environment, production', () => {
    const client = new MockClient('apiKey', 'apiSecret', { env: Environment.Production });

    const expectedURL = 'https://api.getoriginal.com/v1/user/create';
    (axiosCreateStub().post as sinon.SinonStub).withArgs(expectedURL).resolves({});

    client.createUser({ user_external_id: 'user_external_id', email: 'test@test.com' });
    expect((axiosCreateStub().post as sinon.SinonStub).calledWith(expectedURL)).to.be.true;
  });

  it('includes the correct authorization token in headers', async () => {
    const client = new MockClient('apiKey', 'apiSecret');

    client.createUser({ user_external_id: 'user_external_id', email: 'test@test.com' });

    const headers = (axiosCreateStub().post as sinon.SinonStub).getCall(0).args[2].headers;
    const authorizationHeader = headers['Authorization'];
    const jwtToken = authorizationHeader.split(' ')[1];

    expect(verify(jwtToken, 'apiSecret', (err, decoded) => decoded && decoded.api_key === 'apiKey')).to.be.true;
  });
});

describe('Base client error management tests', () => {
  let sandbox: sinon.SinonSandbox;
  let axiosCreateStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    axiosCreateStub = sinon.stub(axios, 'create').returns({
      post: sinon.stub(),
      put: sinon.stub(),
      get: sinon.stub(),
    } as any);
  });

  afterEach(() => {
    sandbox.restore();
    axiosCreateStub.restore();
  });

  it('throws ClientError on client error response', async () => {
    const mockResponse = {
      status: 400,
      data: {
        error: { type: 'client_error', detail: [{ message: 'Client error occurred' }] },
      },
    };

    (axiosCreateStub().post as sinon.SinonStub).rejects({ response: mockResponse });

    const client = new MockClient('apiKey', 'apiSecret');
    await expect(
      client.createUser({ user_external_id: 'user_external_id', email: 'invalid_email' }),
    ).to.eventually.be.rejectedWith(ClientError);
  });

  it('throws ServerError on server error response', async () => {
    const mockResponse = {
      status: 500,
      data: { error: { type: 'server_error', detail: [{ message: 'Server error occurred' }] } },
    };

    (axiosCreateStub().post as sinon.SinonStub).rejects({ response: mockResponse });

    const client = new MockClient('apiKey', 'apiSecret');
    await expect(
      client.createUser({ user_external_id: 'user_external_id', email: 'invalid_email' }),
    ).to.eventually.be.rejectedWith(ServerError);
  });

  it('correctly extracts error message from response detail', async () => {
    const errorMessage = 'Detailed error message';
    const mockResponse = {
      data: { error: { type: 'client_error', detail: [{ message: errorMessage }] } },
      status: 400,
      statusText: 'Bad Request',
    };

    try {
      throwErrorFromResponse(mockResponse as any);
    } catch (error) {
      expect(error).to.be.instanceOf(ClientError);
      expect(error.message).to.equal(errorMessage);
    }
  });
});
