import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Original } from '../../src/client';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Client', async () => {
	it('gets user by uid', async () => {
		const original = new Original('key', 'secret', { baseURL: 'http://localhost:3004' });
		const response = await original.getUser('001');
		// json-server always wraps responses in an array, this doesn't happen in production, but the tests just serve
		// the purpose of testing the client, not the server, so we have to unwrap the response here
		expect(response[0].email).to.equal('mock@test.com');
	});
	it('query user by email', async () => {
		const original = new Original('key', 'secret', { baseURL: 'http://localhost:3004' });
		const response = await original.queryUser({ email: 'mock_2@test.com' });
		expect(response[0].email).to.equal('mock_2@test.com');
	});
	it('query user by client_id', async () => {
		const original = new Original('key', 'secret', { baseURL: 'http://localhost:3004' });
		const response = await original.queryUser({ clientId: 'mock_2' });
		expect(response[0].email).to.equal('mock_2@test.com');
	});
});
