const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Original } = require('../../dist');
const randomString = require('randomstring');

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/sdk/.env` });

const ACCEPTANCE_CHAIN_ID = 80001;
const ACCEPTANCE_NETWORK = 'Mumbai';
describe('Original sdk e2e-method tests', async () => {
	const apiKey = process.env.API_KEY;
	const apiSecret = process.env.API_SECRET;
	const mintToUserUid = process.env.MINT_TO_USER_UID;
	const burnUserUid = process.env.BURN_USER_UID;
	const mintToUserClientId = process.env.MINT_TO_USER_CLIENT_ID;
	const mintToUserEmail = process.env.MINT_TO_USER_EMAIL;
	const transferToUserWallet = process.env.TRANSFER_TO_USER_WALLET;
	const transferToUserUid = process.env.TRANSFER_TO_USER_UID;
	const getAssetUid = process.env.ASSET_UID;
	const nonEditableCollectionUid = process.env.NON_EDITABLE_COLLECTION_UID;
	const editableCollectionUid = process.env.EDITABLE_COLLECTION_UID;
	const acceptanceEndpoint = process.env.ACCEPTANCE_ENDPOINT;

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
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getUser(mintToUserUid);
		expect(response.data.client_id).to.equal(mintToUserClientId);
	});

	it('gets user by email', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getUserByEmail(mintToUserEmail);
		expect(response.data.email).to.equal(mintToUserEmail);
	});

	it('gets user by client_id', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getUserByClientId(mintToUserClientId);
		expect(response.data.email).to.equal(mintToUserEmail);
	});

	it('get user by email does not fail when no query results', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getUserByEmail('randomnotfound@test.com');
		expect(response.data).to.equal(null);
	});

	it('get user not found throws error', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		await expectThrowsAsync(() => original.getUser('notfound'), 'Request failed with status code 404');
	});

	it('creates user', async () => {
		const clientId = randomString.generate(8);
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.createUser({
			email: `${clientId}@test.com`,
			client_id: clientId,
		});
		expect(response.data.uid).to.exist;
	});

	it('gets asset by uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getAsset(getAssetUid);
		expect(response.data.uid).to.equal(getAssetUid);
	});

	it('gets assets by user uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const usersAssets = await original.getAssetsByUserUid(mintToUserUid);
		const assetUid = usersAssets.data[0].uid;
		const response = await original.getAsset(assetUid);
		expect(response.data.uid).to.equal(assetUid);
	});

	it('gets assets/transfers/burns by user uid return empty arrays', async () => {
		const clientId = randomString.generate(8);
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const userResponse = await original.createUser({
			email: `${clientId}@test.com`,
			client_id: clientId,
		});
		const response = await original.getAssetsByUserUid(userResponse.data.uid);
		expect(response.data.length).to.equal(0);

		const transfersResponse = await original.getTransfersByUserUid(userResponse.data.uid);
		expect(transfersResponse.data.length).to.equal(0);

		const burnsResponse = await original.getBurnsByUserUid(userResponse.data.uid);
		expect(burnsResponse.data.length).to.equal(0);
	});

	it('gets transfer by user uid', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const usersTransfers = await original.getTransfersByUserUid(mintToUserUid);
		const transferUid = usersTransfers.data[0].uid;
		const response = await original.getTransfer(transferUid);
		expect(response.data.uid).to.equal(transferUid);
	});

	it('queries and gets burn', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const userBurns = await original.getBurnsByUserUid(burnUserUid);
		const burnUid = userBurns.data[0].uid;
		const response = await original.getBurn(burnUid);
		expect(response.data.uid).to.equal(burnUid);
	});

	it('get collection', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getCollection(nonEditableCollectionUid);
		expect(response.data.uid).to.equal(nonEditableCollectionUid);
	});

	it('get deposit address', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const response = await original.getDeposit(transferToUserUid);
		expect(response.data.wallet_address).to.equal(transferToUserWallet);
		expect(response.data.network).to.equal(ACCEPTANCE_NETWORK);
		expect(response.data.chain_id).to.equal(ACCEPTANCE_CHAIN_ID);
	});

	it('edits asset in an editable collection', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
		const assetName = randomString.generate(8);
		const asset_data = {
			name: assetName,
			unique_name: true,
			image_url: 'https://example.com/image.png',
			store_image_on_ipfs: false,
			description: 'test description',
			attributes: [
				{ trait_type: 'Eyes', value: 'Green' },
				{ trait_type: 'Hair', value: 'Black' },
			],
		};
		const request_data = {
			data: asset_data,
			user_uid: mintToUserUid,
			client_id: assetName,
			collection_uid: editableCollectionUid,
		};
		const assetResponse = await original.createAsset(request_data);
		const assetUid = assetResponse.data.uid;
		let assetIsTransferable = false;
		let retries = 0;
		// wait for asset to be transferable
		while (!assetIsTransferable && retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const asset = await original.getAsset(assetUid);
			assetIsTransferable = asset.data.is_transferable;
			retries++;
		}
		expect(assetIsTransferable).to.equal(true);
		const editData = { ...asset_data, description: 'new description' };
		const editResponse = await original.editAsset(assetUid, { data: editData });
		expect(editResponse.success).to.equal(true);
	});

	it('creates asset, transfer, and burn flow', async () => {
		const original = new Original(apiKey, apiSecret, { baseURL: acceptanceEndpoint });
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
			user_uid: mintToUserUid,
			client_id: assetName,
			collection_uid: editableCollectionUid,
		};
		const assetResponse = await original.createAsset(request_data);
		const assetUid = assetResponse.data.uid;
		let assetIsTransferable = false;
		let retries = 0;
		// wait for asset to be transferable
		while (!assetIsTransferable && retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 20000));
			const asset = await original.getAsset(assetUid);
			assetIsTransferable = asset.data.is_transferable;
			retries++;
		}
		expect(assetIsTransferable).to.equal(true);
		const transferResponse = await original.createTransfer({
			asset_uid: assetUid,
			from_user_uid: mintToUserUid,
			to_address: transferToUserWallet,
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
			from_user_uid: transferToUserUid,
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
