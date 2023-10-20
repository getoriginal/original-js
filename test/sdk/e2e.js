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
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getUser('180861586559');
		expect(response.data.client_id).to.equal('76KF7s6J');
	});

	it('gets user by email', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getUserByEmail('76KF7s6J@test.com');
		expect(response.data.email).to.equal('76KF7s6J@test.com');
	});

	it('gets user by client_id', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getUserByClientId('76KF7s6J');
		expect(response.data.email).to.equal('76KF7s6J@test.com');
	});

	it('get user by email does not fail when no query results', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getUserByEmail('randomnotfound@test.com');
		expect(response.data).to.equal(null);
	});

	it('get user not found throws error', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		await expectThrowsAsync(() => original.getUser('notfound'), 'Request failed with status code 404');
	});

	it('creates user', async () => {
		const clientId = randomString.generate(8);
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.createUser({
			email: `${clientId}@test.com`,
			client_id: clientId,
		});
		expect(response.data.uid).to.exist;
	});

	it('gets asset by uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getAsset('460354772250');
		expect(response.data.uid).to.equal('460354772250');
	});

	it('gets assets by user uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const usersAssets = await original.getAssetsByUserId('180861586559');
		const assetUid = usersAssets.data[0].uid;
		const response = await original.getAsset(assetUid);
		expect(response.data.uid).to.equal(assetUid);
	});

	it('gets transfer by user uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const usersTransfers = await original.getTransfersByUserUid('180861586559');
		const transferUid = usersTransfers.data[0].uid;
		const response = await original.getTransfer(transferUid);
		expect(response.data.uid).to.equal(transferUid);
	});

	it('queries and gets burn', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const userBurns = await original.getBurnsByUserUid('815003329309');
		const burnUid = userBurns.data[0].uid;
		const response = await original.getBurn(burnUid);
		expect(response.data.uid).to.equal(burnUid);
	});

	it('get collection', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const response = await original.getCollection('281855194716');
		expect(response.data.uid).to.equal('281855194716');
	});

	it('creates asset, transfer, and burn flow', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: 'https://api-acceptance.getoriginal.com/api/v1' });
		const assetName = randomString.generate(8);
		const asset_data = {
			name: assetName,
			unique_name: true,
			image_url: 'https://example.com/image.png',
			store_image_on_ipfs: false,
			attributes: [
				{ trait_type: 'Eyes', value: 'Green' },
				{ trait_type: 'Hair', value: 'Black' },
			],
		};
		const request_data = {
			data: asset_data,
			user_uid: '180861586559',
			client_id: assetName,
			collection_uid: '281855194716',
		};
		const assetResponse = await original.createAsset(request_data);
		const assetUid = assetResponse.data.uid;
		let assetIsTransferable = false;
		let retries = 0;
		// wait for asset to be transferable
		while (!assetIsTransferable && retries < 5) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const asset = await original.getAsset(assetUid);
			assetIsTransferable = asset.data.is_transferable;
			retries++;
		}
		expect(assetIsTransferable).to.equal(true);
		const transferResponse = await original.createTransfer({
			asset_uid: assetUid,
			from_user_uid: '180861586559',
			to_address: '0x9da9fdff40e4421acfad2525f661854d8a037956',
		});
		const transferUid = transferResponse.data.uid;
		let isTransferring = true;
		retries = 0;
		// wait for transfer to be done
		while (isTransferring && retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const asset = await original.getAsset(assetUid);
			isTransferring = asset.data.is_transferring;
			retries++;
		}
		const transfer = await original.getTransfer(transferUid);
		expect(transfer.data.status).to.equal('done');
		const burnResponse = await original.createBurn({
			asset_uid: assetUid,
			from_user_uid: '833240820809',
		});
		const burnUid = burnResponse.data.uid;
		let isBurning = true;
		retries = 0;
		// wait for burn to be done
		while (isBurning && retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const burn = await original.getBurn(burnUid);
			isBurning = burn.data.status !== 'done';
			retries++;
		}
		const burn = await original.getBurn(burnUid);
		expect(burn.data.status).to.equal('done');
		let finalAssetBurnStatus = false;
		retries = 0;
		// there is a delay between when the burn is done and when the asset is burned field is updated
		while (!finalAssetBurnStatus && retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const finalAsset = await original.getAsset(assetUid);
			finalAssetBurnStatus = finalAsset.data.is_burned;
			retries++;
		}
		const finalAsset = await original.getAsset(assetUid);
		expect(finalAsset.data.is_burned).to.equal(true);
	});
});
