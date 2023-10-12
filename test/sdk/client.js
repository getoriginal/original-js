const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Original } = require('../../dist');
const { verify } = require('jsonwebtoken');

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/sdk/.env` });

describe('Original sdk tests', async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;

	it('sets baseURL when constructed with baseURL config', () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'http://localhost:3004' });
		expect(original.baseURL).to.equal('http://localhost:3004');
	});

	it('sets baseURL dependent on environment in config', () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		expect(original.baseURL).to.equal('https://api-acceptance.getoriginal.com/api/v1');
	});

	it('jwt token is valid', () => {
		const original = new Original(apiKey, apiSecret);
		const token = original.tokenManager.getToken();
		expect(
			verify(token, apiSecret, function (err, decoded) {
				return decoded.api_key === apiKey;
			}),
		).to.be.true;
	});
});
