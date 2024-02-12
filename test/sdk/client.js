import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Original, OriginalClient, Environment } from '../../dist/';
import { verify } from 'jsonwebtoken';

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/sdk/.env` });

describe('Original sdk tests', async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;

	it('is backwards compatible with Original and OriginalClient', () => {
		const originalClient = new OriginalClient(apiKey, apiSecret, { baseURL: 'http://localhost:3004' });
		const original = new Original(apiKey, apiSecret, { baseURL: 'http://localhost:3004' });
		expect(originalClient).instanceof(OriginalClient);
		expect(original).instanceof(OriginalClient);
	});

	it('sets baseURL when constructed with baseURL config', () => {
		const original = new OriginalClient(apiKey, apiSecret, { baseURL: 'http://localhost:3004' });
		expect(original.baseURL).to.equal('http://localhost:3004');
	});

	it('sets baseURL dependent on environment in config, development', () => {
		const original = new OriginalClient(apiKey, apiSecret, { env: Environment.Development });
		expect(original.baseURL).to.equal('https://api-dev.getoriginal.com/v1');
	});

	it('sets baseURL dependent on environment in config, production', () => {
		const original = new OriginalClient(apiKey, apiSecret, { env: Environment.Production });
		expect(original.baseURL).to.equal('https://api.getoriginal.com/v1');
	});

	it('sets baseURL when no env or baseURL arguments are passed', () => {
		const original = new OriginalClient(apiKey, apiSecret);
		expect(original.baseURL).to.equal('https://api.getoriginal.com/v1');
	});

	it('jwt token is valid', () => {
		const original = new OriginalClient(apiKey, apiSecret);
		const token = original.tokenManager.getToken();
		expect(
			verify(token, apiSecret, function (err, decoded) {
				return decoded.api_key === apiKey;
			}),
		).to.be.true;
	});
});
