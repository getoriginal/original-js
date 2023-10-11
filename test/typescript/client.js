const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Original } = require('../../dist');

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/typescript/.env` });

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

	it('gets user by uid', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.getUser('916560423856');
		expect(response.data.client_id).to.equal('q3YebGkm');
	});

	it('query user by email', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.queryUser({ email: 'q3YebGkm@test.com' });
		expect(response.data.email).to.equal('q3YebGkm@test.com');
	});

	it('query user by client_id', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.queryUser({ client_id: 'q3YebGkm' });
		expect(response.data.email).to.equal('q3YebGkm@test.com');
	});
});
