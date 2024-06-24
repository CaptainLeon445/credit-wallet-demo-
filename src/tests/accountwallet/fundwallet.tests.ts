import request from 'supertest';
import server from '../../server';

describe('Fund wallet test cases', () => {
  let id: number;
  let token: string;
  beforeAll(async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'password113',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'password113',
    });
    id = user.body.id;
    token = user.body.accessToke;
  });

  it('should fund user wallet', async () => {
    const res = await request(server).post('/v1/api/wallet/fund').send({
      id,
      amount: 1000,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 1000);
  });

  it('should fund wallet by inactive user', async () => {
    const res = await request(server).post('/v1/api/wallet/fund').send({
      id,
      amount: 1000,
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should fund inactive wallet', async () => {
    const res = await request(server).post('/v1/api/wallet/fund').send({
      id,
      amount: 1000,
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
