import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
	Original,
	OriginalClient,
	Environment,
	ClientError,
	ServerError,
	ValidationError,
	throwErrorFromResponse,
} from '../../dist';
import { verify } from 'jsonwebtoken';
import sinon from 'sinon';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Original client initialisation tests', async () => {
	it('is backwards compatible with Original and OriginalClient', () => {
		const originalClient = new OriginalClient('apiKey', 'apiSecret', { baseURL: 'http://localhost:3004' });
		const original = new Original('apiKey', 'apiSecret', { baseURL: 'http://localhost:3004' });
		expect(originalClient).instanceof(OriginalClient);
		expect(original).instanceof(OriginalClient);
	});

	it('sets baseURL when constructed with baseURL config', () => {
		const original = new OriginalClient('apiKey', 'apiSecret', { baseURL: 'http://localhost:3004' });
		expect(original.baseURL).to.equal('http://localhost:3004');
	});

	it('sets baseURL dependent on environment in config, development', () => {
		const original = new OriginalClient('apiKey', 'apiSecret', { env: Environment.Development });
		expect(original.baseURL).to.equal('https://api-dev.getoriginal.com/v1');
	});

	it('sets baseURL dependent on environment in config, production', () => {
		const original = new OriginalClient('apiKey', 'apiSecret', { env: Environment.Production });
		expect(original.baseURL).to.equal('https://api.getoriginal.com/v1');
	});

	it('sets baseURL when no env or baseURL arguments are passed', () => {
		const original = new OriginalClient('apiKey', 'apiSecret');
		expect(original.baseURL).to.equal('https://api.getoriginal.com/v1');
	});

	it('jwt token is valid', () => {
		const original = new OriginalClient('apiKey', 'apiSecret');
		const token = original.tokenManager.getToken();
		expect(
			verify(token, 'apiSecret', function (err, decoded) {
				return decoded.api_key === 'apiKey';
			}),
		).to.be.true;
	});
});

describe('Original client error management tests', () => {
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('throws ClientError on client error response', async () => {
		const mockResponse = {
			status: 400,
			data: {
				error: {
					type: 'client_error',
					detail: [{ message: 'Client error occurred' }],
				},
			},
		};

		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox.stub(original.axiosInstance, 'post').rejects({ response: mockResponse });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(ClientError);
	});

	it('throws ServerError on server error response', async () => {
		const mockResponse = {
			status: 500,
			data: {
				error: {
					type: 'server_error',
					detail: [{ message: 'Server error occurred' }],
				},
			},
		};

		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox.stub(original.axiosInstance, 'post').rejects({ response: mockResponse });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(ServerError);
	});

	it('throws ValidationError on validation error response', async () => {
		const mockResponse = {
			status: 422,
			data: {
				error: {
					type: 'validation_error',
					detail: [{ message: 'Validation error occurred' }],
				},
			},
		};

		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox.stub(original.axiosInstance, 'post').rejects({ response: mockResponse });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(ValidationError);
	});

	it('correctly extracts error message from response detail', async () => {
		const errorMessage = 'Detailed error message';
		const mockResponse = {
			data: {
				error: {
					type: 'client_error',
					detail: [{ message: errorMessage }],
				},
			},
			status: 400,
			statusText: 'Bad Request',
		};

		try {
			throwErrorFromResponse(mockResponse);
		} catch (error) {
			expect(error).to.be.instanceOf(ClientError);
			expect(error.message).to.equal(errorMessage);
		}
	});

	it('handles network errors gracefully', async () => {
		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox.stub(original.axiosInstance, 'post').rejects(new Error('Network Error'));

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(Error);
	});

	it('throws an error on request timeout', async () => {
		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox
			.stub(original.axiosInstance, 'post')
			.rejects({ code: 'ECONNABORTED', message: 'timeout of 0ms exceeded' });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(Error);
	});

	it('handles unexpected status codes', async () => {
		const mockResponse = {
			status: 418,
			data: {
				message: "I'm a teapot",
			},
		};

		const original = new OriginalClient('apiKey', 'apiSecret');
		sandbox.stub(original.axiosInstance, 'post').rejects({ response: mockResponse });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(Error);
	});

	it('can make a successful request after handling an error', async () => {
		const original = new OriginalClient('apiKey', 'apiSecret');

		// First, mock a failure
		sandbox
			.stub(original.axiosInstance, 'post')
			.onFirstCall()
			.rejects({ response: { status: 500, data: { error: { type: 'server_error' } } } })
			// Then, mock a success
			.onSecondCall()
			.resolves({ status: 200, data: { success: true } });

		// Expect the first call to fail
		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(ServerError);

		// Expect the second call to succeed
		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.fulfilled;
	});

	it('handles errors without a response body gracefully', async () => {
		const mockResponse = {
			status: 500,
			data: {}, // No error details provided
		};
		const original = new OriginalClient('apiKey', 'apiSecret');

		sandbox.stub(original.axiosInstance, 'post').rejects({ response: mockResponse });

		await expect(original.createUser({ user_external_id: 'user_external_id', email: 'invalid_email'})).to.eventually.be.rejectedWith(Error);
	});
});
