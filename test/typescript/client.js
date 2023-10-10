const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Original } = require('../../dist');

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/typescript/.env` });

describe('Original sdk tests', async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;

	// it('sets baseURL when constructed with baseURL config', () => {
	// 	const original = new Original(apiKey, apiSecret, { baseURL: 'http://localhost:3004' });
	// 	expect(original.baseURL).to.equal('http://localhost:3004');
	// });
	//
	// it('sets baseURL dependent on environment in config', () => {
	// 	const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
	// 	expect(original.baseURL).to.equal('https://api-acceptance.getoriginal.com/api/v1');
	// });

	it('gets user by uid', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		console.log(apiKey, apiSecret);
		const response = await original.getUser('001');
		console.log('RESPONSE', response);
		expect(response[0].email).to.equal('mock@test.com');
	});

	// it('query user by email', async () => {
	// 	const original = new Original('key', 'secret', { baseURL: 'http://localhost:3004' });
	// 	const response = await original.queryUser({ email: 'mock_2@test.com' });
	// 	expect(response[0].email).to.equal('mock_2@test.com');
	// });
	// it('query user by client_id', async () => {
	// 	const original = new Original('key', 'secret', { baseURL: 'http://localhost:3004' });
	// 	const response = await original.queryUser({ clientId: 'mock_2' });
	// 	expect(response[0].email).to.equal('mock_2@test.com');
	// });
});
