import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { OriginalClient, OriginalError, ClientError, ValidationError, AssetData, AssetParams } from '../../src';
import randomString from 'randomstring';

const expect = chai.expect;
chai.use(chaiAsPromised);
require('dotenv').config({ path: `${process.cwd()}/test/e2e/.env` });

const RETRY_COUNT = 10;
describe('Original sdk e2e-method tests', async () => {
  const apiKey = process.env.ORIGINAL_API_KEY!;
  const apiSecret = process.env.ORIGINAL_API_SECRET!;
  const baseURL = process.env.ORIGINAL_BASE_URL!;
  const appUserUid = process.env.TEST_APP_USER_UID!;
  const mintToUserUserExternalId = process.env.TEST_APP_USER_USER_EXTERNAL_ID!;
  const mintToUserEmail = process.env.TEST_APP_USER_EMAIL!;
  const transferToUserWallet = process.env.TEST_TRANSFER_TO_WALLET_ADDRESS!;
  const transferToUserUid = process.env.TEST_TRANSFER_TO_USER_UID!;
  const burnToUserUid = process.env.TEST_TRANSFER_TO_USER_UID!;
  const getAssetUid = process.env.TEST_ASSET_UID!;
  const editableCollectionUid = process.env.TEST_COLLECTION_UID!;
  const getAllocationUid = process.env.TEST_ALLOCATION_UID!;
  const getClaimUid = process.env.TEST_CLAIM_UID!;
  const rewardUid = process.env.TEST_REWARD_UID!;
  const claimToAddress = process.env.TEST_CLAIM_TO_ADDRESS!;

  it('gets user by uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getUser(appUserUid);
    expect(response.data.wallets).to.be.an('array');
    expect(response.data.user_external_id).to.equal(mintToUserUserExternalId);
  });

  it('gets user by email', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getUserByEmail(mintToUserEmail);
    expect(response.data?.email).to.equal(mintToUserEmail);
  });

  it('gets user by user_external_id', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getUserByUserExternalId(mintToUserUserExternalId);
    expect(response.data?.email).to.equal(mintToUserEmail);
  });

  it('get user by email does not fail when no query results', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getUserByEmail('randomnotfound@test.com');
    expect(response.data).to.equal(null);
  });

  it('get user with empty params throws a client not found error', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    try {
      await original.getUser('');
      expect.fail('getUser should have thrown an error');
    } catch (error) {
      expect(error).to.be.instanceOf(ClientError);
      expect(error.message).to.equal('Not Found');
    }
  });

  it('get user not found throws client error', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    try {
      await original.getUser('notfound');
      expect.fail('getUser should have thrown an error');
    } catch (error) {
      expect(error).to.be.instanceOf(OriginalError);
      expect(error).to.be.instanceOf(ClientError);
      expect(error.status).to.equal(404);
      expect(error.message).to.equal('User not found.');
    }
  });

  it('creates user with params', async () => {
    const userExternalId = randomString.generate(8);
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.createUser({
      email: `${userExternalId}@test.com`,
      user_external_id: userExternalId,
    });
    expect(response.data.uid).to.exist;
  });

  it('creates user with no params', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.createUser();
    expect(response.data.uid).to.exist;
  });

  it('handles validation error on create user', async () => {
    const userExternalId = randomString.generate(8);
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    try {
      await original.createUser({
        email: `invalid_email`,
        user_external_id: userExternalId,
      });
      expect.fail('createUser should have thrown an error');
    } catch (error) {
      expect(error).to.be.instanceOf(OriginalError);
      expect(error).to.be.instanceOf(ValidationError);
      expect(error.status).to.equal(400);
      expect(error.message).to.equal('Enter a valid email address.');
    }
  });

  it('handles client error on create user', async () => {
    const userExternalId = 'existing_client';
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    try {
      await original.createUser({
        email: `${userExternalId}@test.com`,
        user_external_id: userExternalId,
      });
      expect.fail('createUser should have thrown an error');
    } catch (error) {
      expect(error).to.be.instanceOf(OriginalError);
      expect(error).to.be.instanceOf(ClientError);
      expect(error.status).to.equal(400);
      expect(error.message).to.equal('User already exists.');
    }
  });

  it('gets asset by uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getAsset(getAssetUid);
    expect(response.data.uid).to.equal(getAssetUid);
  });

  it('gets assets by user uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const usersAssets = await original.getAssetsByUserUid(appUserUid);
    const assetUid = usersAssets.data[0].uid;
    const response = await original.getAsset(assetUid);
    expect(response.data.uid).to.equal(assetUid);
  });

  it('gets by user uid return empty arrays', async () => {
    const userExternalId = randomString.generate(8);
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const userResponse = await original.createUser({
      email: `${userExternalId}@test.com`,
      user_external_id: userExternalId,
    });
    const response = await original.getAssetsByUserUid(userResponse.data.uid);
    expect(response.data.length).to.equal(0);

    const transfersResponse = await original.getTransfersByUserUid(userResponse.data.uid);
    expect(transfersResponse.data.length).to.equal(0);

    const burnsResponse = await original.getBurnsByUserUid(userResponse.data.uid);
    expect(burnsResponse.data.length).to.equal(0);

    const allocationsResponse = await original.getAllocationsByUserUid(userResponse.data.uid);
    expect(allocationsResponse.data.length).to.equal(0);

    const claimsResponse = await original.getClaimsByUserUid(userResponse.data.uid);
    expect(claimsResponse.data.length).to.equal(0);
  });

  it('gets transfer by user uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const usersTransfers = await original.getTransfersByUserUid(appUserUid);
    const transferUid = usersTransfers.data[0].uid;
    const response = await original.getTransfer(transferUid);
    expect(response.data.uid).to.equal(transferUid);
  });

  it('queries and gets burn', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const userBurns = await original.getBurnsByUserUid(burnToUserUid);
    const burnUid = userBurns.data[0].uid;
    const response = await original.getBurn(burnUid);
    expect(response.data.uid).to.equal(burnUid);
  });

  it('get collection', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getCollection(editableCollectionUid);
    expect(response.data.uid).to.equal(editableCollectionUid);
  });

  it('get deposit', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getDeposit(transferToUserUid, editableCollectionUid);
    expect(response.data.wallet_address).to.equal(transferToUserWallet);
    expect(response.data.network).to.be.a('string');
    expect(response.data.chain_id).to.be.a('number');
  });

  it('get reward', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getReward(rewardUid);
    expect(response.data.uid).to.equal(rewardUid);
  });

  it('gets allocation by uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getAllocation(getAllocationUid);
    expect(response.data.uid).to.equal(getAllocationUid);
  });

  it('gets allocations by user uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const usersAllocations = await original.getAllocationsByUserUid(appUserUid);
    const allocationUid = usersAllocations.data[0].uid;
    const response = await original.getAllocation(allocationUid);
    expect(response.data.uid).to.equal(allocationUid);
  });

  it('gets claim by uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getClaim(getClaimUid);
    expect(response.data.uid).to.equal(getClaimUid);
  });

  it('gets claims by user uid', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const usersClaims = await original.getClaimsByUserUid(appUserUid);
    const claimUid = usersClaims.data[0].uid;
    const response = await original.getClaim(claimUid);
    expect(response.data.uid).to.equal(claimUid);
  });

  it('edits asset in an editable collection', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
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
      user_uid: appUserUid,
      asset_external_id: assetName,
      collection_uid: editableCollectionUid,
    };
    const assetResponse = await original.createAsset(request_data);
    const assetUid = assetResponse.data.uid;
    let assetIsTransferable = false;
    let retries = 0;
    // wait for asset to be transferable
    while (!assetIsTransferable && retries < RETRY_COUNT) {
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
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
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
      user_uid: appUserUid,
      asset_external_id: assetName,
      collection_uid: editableCollectionUid,
    };
    const assetResponse = await original.createAsset(request_data);
    const assetUid = assetResponse.data.uid;
    let assetIsTransferable = false;
    let retries = 0;
    // wait for asset to be transferable
    while (!assetIsTransferable && retries < RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      const asset = await original.getAsset(assetUid);
      assetIsTransferable = asset.data.is_transferable;
      retries++;
    }
    expect(assetIsTransferable).to.equal(true);
    const transferResponse = await original.createTransfer({
      asset_uid: assetUid,
      from_user_uid: appUserUid,
      to_address: transferToUserWallet,
    });
    const transferUid = transferResponse.data.uid;
    let isTransferring = true;
    retries = 0;
    // wait for transfer to be done
    while (isTransferring && retries < RETRY_COUNT) {
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
    while (isBurning && retries < RETRY_COUNT) {
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
    while (!finalAssetBurnStatus && retries < RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      const finalAsset = await original.getAsset(assetUid);
      finalAssetBurnStatus = finalAsset.data.is_burned;
      retries++;
    }
    const finalAsset = await original.getAsset(assetUid);
    expect(finalAsset.data.is_burned).to.equal(true);
  });

  it('creates allocation and claim flow', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const allocationResponse = await original.createAllocation({
      amount: 0.001,
      nonce: randomString.generate(8),
      reward_uid: rewardUid,
      to_user_uid: appUserUid,
    });
    const allocationUid = allocationResponse.data.uid;
    let isAllocating = true;
    let retries = 0;
    // wait for allocation to be done
    while (isAllocating && retries < RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      const allocation = await original.getAllocation(allocationUid);
      isAllocating = allocation.data.status !== 'done';
      retries++;
    }
    const allocation = await original.getAllocation(allocationUid);
    expect(allocation.data.status).to.equal('done');
    const claimResponse = await original.createClaim({
      from_user_uid: appUserUid,
      reward_uid: rewardUid,
      to_address: claimToAddress,
    });
    const claimUid = claimResponse.data.uid;
    let isClaiming = true;
    retries = 0;
    // wait for claim to be done
    while (isClaiming && retries < RETRY_COUNT) {
      await new Promise((resolve) => setTimeout(resolve, 20000));
      const claim = await original.getClaim(claimUid);
      isClaiming = claim.data.status !== 'done';
      retries++;
    }
    const claim = await original.getClaim(claimUid);
    expect(claim.data.status).to.equal('done');
  });

  it('gets a users reward balance', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const response = await original.getBalance(rewardUid, appUserUid);
    expect(response.data.amount).to.be.a('number');
  });

  it('creates an asset with a mint price', async () => {
    const original = new OriginalClient(apiKey, apiSecret, { baseURL });
    const assetName = randomString.generate(8);
    const asset_data: AssetData = {
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
    const request_data: AssetParams = {
      data: asset_data,
      user_uid: appUserUid,
      asset_external_id: assetName,
      collection_uid: editableCollectionUid,
      sale_price_in_usd: 9.99,
    };
    const assetResponse = await original.createAsset(request_data);
    const assetUid = assetResponse.data.uid;
    expect(assetUid).to.exist;
  });
});
