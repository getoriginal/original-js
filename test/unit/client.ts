import chai from 'chai';
import sinon from 'sinon';
import {
  APIResponse,
  UidResponse,
  User,
  Collection,
  Asset,
  Transfer,
  Burn,
  Deposit,
  Reward,
  Allocation,
  Claim,
  Balance,
  UserParams,
  AssetParams,
  TransferParams,
  AllocationParams,
  ClaimParams,
} from '../../src/types';
import { OriginalClient } from '../../src';

const expect = chai.expect;

describe('OriginalClient API methods', () => {
  let client: OriginalClient;
  let stub: sinon.SinonStub;

  beforeEach(() => {
    client = new OriginalClient('apiKey', 'apiSecret');
    stub = sinon.stub(client as any, '_post');
    sinon.stub(client as any, '_get');
    sinon.stub(client as any, '_put');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('createUser should call _post with correct params', async () => {
    const userParams: UserParams = { email: 'johndoe@email.com', user_external_id: 'ueid' };
    stub.resolves({ data: { uid: 'user123' }, success: true } as APIResponse<UidResponse>);
    const result = await client.createUser(userParams);

    expect(stub.calledOnceWith('user', userParams)).to.be.true;
    expect(result.data).to.eql({ uid: 'user123' });
  });

  it('getUser should call _get with correct uid', async () => {
    const uid = 'user123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<User>);
    const result = await client.getUser(uid);

    expect((client as any)._get.calledOnceWith(`user/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('getUserByEmail should call _get with correct email', async () => {
    const email = 'test@example.com';
    (client as any)._get.resolves({ data: { email } } as APIResponse<User | null>);
    const result = await client.getUserByEmail(email);

    expect((client as any)._get.calledOnceWith('user', { email })).to.be.true;
    expect(result.data?.email).to.equal(email);
  });

  it('getCollection should call _get with correct uid', async () => {
    const uid = 'collection123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Collection>);
    const result = await client.getCollection(uid);

    expect((client as any)._get.calledOnceWith(`collection/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('createAsset should call _post with correct asset params', async () => {
    const assetParams: AssetParams = {
      asset_external_id: 'asset123',
      collection_uid: 'collection123',
      data: {
        image_url: 'http://example.com/image.png',
        store_image_on_ipfs: true,
        unique_name: true,
        name: 'New Asset',
      },
      user_uid: 'user123',
      sale_price_in_usd: 100,
    };
    stub.resolves({ data: { uid: 'asset123' }, success: true } as APIResponse<UidResponse>);
    const result = await client.createAsset(assetParams);

    expect(stub.calledOnceWith('asset', assetParams)).to.be.true;
    expect(result.data.uid).to.equal('asset123');
  });

  it('getAsset should call _get with correct uid', async () => {
    const uid = 'asset123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Asset>);
    const result = await client.getAsset(uid);

    expect((client as any)._get.calledOnceWith(`asset/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('createTransfer should call _post with correct transfer params', async () => {
    const transferParams: TransferParams = {
      asset_uid: 'asset123',
      from_user_uid: 'user123',
      to_address: '0x123',
    };
    stub.resolves({ data: { uid: 'transfer123' } } as APIResponse<UidResponse>);
    const result = await client.createTransfer(transferParams);

    expect(stub.calledOnceWith('transfer', transferParams)).to.be.true;
    expect(result.data.uid).to.equal('transfer123');
  });

  it('getTransfer should call _get with correct uid', async () => {
    const uid = 'transfer123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Transfer>);
    const result = await client.getTransfer(uid);

    expect((client as any)._get.calledOnceWith(`transfer/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('createBurn should call _post with correct burn params', async () => {
    const burnParams = {
      asset_uid: 'asset123',
      from_user_uid: 'user123',
    };
    stub.resolves({ data: { uid: 'burn123' } } as APIResponse<UidResponse>);
    const result = await client.createBurn(burnParams);

    expect(stub.calledOnceWith('burn', burnParams)).to.be.true;
    expect(result.data.uid).to.equal('burn123');
  });

  it('getBurn should call _get with correct uid', async () => {
    const uid = 'burn123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Burn>);
    const result = await client.getBurn(uid);

    expect((client as any)._get.calledOnceWith(`burn/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('getDeposit should call _get with correct params', async () => {
    const userUid = 'user123';
    const collectionUid = 'collection123';
    const deposit: Deposit = {
      chain_id: 80002,
      network: 'amoy',
      qr_code_data: 'qr_code_data',
      wallet_address: 'wallet_address',
    };

    (client as any)._get.resolves({ data: deposit } as APIResponse<Deposit>);
    const result = await client.getDeposit(userUid, collectionUid);

    expect((client as any)._get.calledOnceWith('deposit', { user_uid: userUid, collection_uid: collectionUid })).to.be
      .true;
    expect(result.data).to.equal(deposit);
  });

  it('getReward should call _get with correct uid', async () => {
    const uid = 'reward123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Reward>);
    const result = await client.getReward(uid);

    expect((client as any)._get.calledOnceWith(`reward/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('createAllocation should call _post with correct allocation params', async () => {
    const allocationParams: AllocationParams = {
      amount: 100,
      reward_uid: 'reward123',
      to_user_uid: 'user123',
      nonce: 'nonce123',
    };
    stub.resolves({ data: { uid: 'allocation123' } } as APIResponse<UidResponse>);
    const result = await client.createAllocation(allocationParams);

    expect(stub.calledOnceWith('reward/allocate', allocationParams)).to.be.true;
    expect(result.data.uid).to.equal('allocation123');
  });

  it('getAllocation should call _get with correct uid', async () => {
    const uid = 'allocation123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Allocation>);
    const result = await client.getAllocation(uid);

    expect((client as any)._get.calledOnceWith(`reward/allocate/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('createClaim should call _post with correct claim params', async () => {
    const claimParams: ClaimParams = {
      to_address: '0x123',
      reward_uid: 'reward123',
      from_user_uid: 'user123',
    };
    stub.resolves({ data: { uid: 'claim123' } } as APIResponse<UidResponse>);
    const result = await client.createClaim(claimParams);

    expect(stub.calledOnceWith('reward/claim', claimParams)).to.be.true;
    expect(result.data.uid).to.equal('claim123');
  });

  it('getClaim should call _get with correct uid', async () => {
    const uid = 'claim123';
    (client as any)._get.resolves({ data: { uid } } as APIResponse<Claim>);
    const result = await client.getClaim(uid);

    expect((client as any)._get.calledOnceWith(`reward/claim/${uid}`)).to.be.true;
    expect(result.data.uid).to.equal(uid);
  });

  it('getBalance should call _get with correct params', async () => {
    const rewardUid = 'reward123';
    const userUid = 'user123';
    const balance: Balance = {
      reward_uid: rewardUid,
      user_uid: userUid,
      amount: 200,
    };
    (client as any)._get.resolves({ data: balance } as APIResponse<Balance>);
    const result = await client.getBalance(rewardUid, userUid);

    expect((client as any)._get.calledOnceWith('reward/balance', { reward_uid: rewardUid, user_uid: userUid })).to.be
      .true;
    expect(result.data.amount).to.equal(200);
  });
});
