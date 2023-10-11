const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Original } = require('../../dist');
const randomString = require('randomstring');

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/sdk/.env` });

describe('Original sdk e2e-method tests', async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;

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

	it('creates user', async () => {
		const clientId = randomString.generate(8);
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.createUser({
			email: `${clientId}@test.com`,
			client_id: clientId,
		});
		expect(response.data.uid).to.exist;
	});
});
