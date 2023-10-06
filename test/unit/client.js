import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Original } from '../../src/client';


const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Client', async () => {
    it('gets user by uid', async () => {
        const original = new Original('key', 'secret')
        const response = await original.getUserByUid('001')
        console.log(response)
        expect(response.user.email).to.equal('mock@test.com')
    })
})