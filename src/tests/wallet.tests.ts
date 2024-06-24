import request from 'supertest';
import server from '../server';

describe('Wallet Endpoints', () => {
  let uid: number;
  beforeAll(async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'password113',
    });
    uid = res.body.id;
  });
  it('should fund user wallet', async () => {
    const res = await request(server).post('/v1/api/wallet/fund').send({
      uid,
      amount: 1000,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 1000);
  });

  it('should transfer funds between users', async () => {
    const user = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris2',
      email: 'mrchris2@mail.uk',
      password: 'password123',
    });
    const toUid = user.body.id;
    await request(server).post('/v1/api/wallet/fund').send({
      uid,
      amount: 100,
    });
    const res = await request(server).post('/v1/api/wallet/transfer').send({
      fromUid: uid,
      toUid,
      amount: 50,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('balance', 50);
  });

  it('should withdraw funds from user wallet', async () => {
    await request(server).post('/v1/api/wallet/fund').send({
      uid,
      amount: 50,
    });
    const res = await request(server).post('/v1/api/wallet/withdraw').send({
      uid,
      amount: 25,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 25);
  });
});
