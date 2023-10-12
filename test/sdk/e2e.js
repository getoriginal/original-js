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

	const expectThrowsAsync = async (method, errorMessage) => {
		let error = null;
		try {
			await method();
		} catch (err) {
			error = err;
		}
		expect(error).to.be.an('Error');
		if (errorMessage) {
			expect(error.message).to.equal(errorMessage);
		}
	};

	it('gets user by uid', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.getUser('180861586559');
		expect(response.data.client_id).to.equal('76KF7s6J');
	});

	it('query user by email', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.queryUser({ email: '76KF7s6J@test.com' });
		expect(response.data.email).to.equal('76KF7s6J@test.com');
	});

	it('query user by client_id', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.queryUser({ client_id: '76KF7s6J' });
		expect(response.data.email).to.equal('76KF7s6J@test.com');
	});

	it('query does not fail when no query results', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.queryUser({ email: 'randomnotfound@test.com' });
		console.log(response);
		expect(response.data).to.equal(null);
	});

	it('get user not found throws error', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		await expectThrowsAsync(() => original.getUser('notfound'), 'Request failed with status code 404');
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

	it('gets asset by uid', async () => {
		const original = new Original(apiKey, apiSecret, { env: 'acceptance' });
		const response = await original.getAsset('460354772250');
		expect(response.data.owner_user_uid).to.equal('76KF7s6J');
	});
});
