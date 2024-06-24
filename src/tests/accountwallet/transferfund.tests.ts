import request from 'supertest';
import server from '../../server';

describe('Transfer funds through wallets test cases', () => {
  let id: number;
  let aid: number;
  let deactivatedId: number;
  let token: string;
  let deactivatedToken: string;
  let deactivatedWallet: string;

  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'Password113#',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Password113#',
    });
    const user2 = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris2',
      email: 'mrchris2@mail.uk',
      password: 'password123',
    });
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdev',
      email: 'mrchrisv@mail.uk',
      password: 'password123',
    });
    const user3 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdev',
      password: 'Password113#',
    });
    await request(server)
      .post('/v1/api/account/deactivate')
      .set('Authorization', `Bearer ${user3.body.accessToken}`);
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdel',
      email: 'mrchris2l@mail.uk',
      password: 'password123',
    });
    const user4 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdel',
      password: 'Password113#',
    });
    await request(server)
      .post('/v1/api/account/deactivate')
      .set('Authorization', `Bearer ${user4.body.accessToken}`);

    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdelw',
      email: 'mrchris2lw@mail.uk',
      password: 'password123',
    });
    const user5 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdelw',
      password: 'Password113#',
    });
    await request(server)
      .post('/v1/api/wallets/deactivate')
      .set('Authorization', `Bearer ${user5.body.accessToken}`);

    id = user.body.id;
    aid = user2.body.id;
    deactivatedId = user3.body.id;
    deactivatedToken = user4.body.accessToken;
    deactivatedWallet = user5.body.accessToken;
    token = user.body.accessToken;
  });

  it('should transfer fund to another user', async () => {
    await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/fund')
      .send({
        id,
        amount: 100,
      });
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/transfer')
      .send({
        receiverWalletId: aid,
        amount: 50,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 50);
  });

  it('should transfer fund to another user from inactive account', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${deactivatedToken}`)
      .post('/v1/api/wallet/transfer')
      .send({
        receiverWalletId: aid,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should transfer fund to user with no record in the db', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/transfer')
      .send({
        receiverWalletId: 88,
        amount: 50,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should transfer fund to inactive wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/transfer')
      .send({
        receiverWalletId: deactivatedId,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should transfer fund from inactive wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${deactivatedWallet}`)
      .post('/v1/api/wallet/transfer')
      .send({
        receiverWalletId: aid,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
