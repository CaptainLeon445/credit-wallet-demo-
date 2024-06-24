import request from 'supertest';
import server from '../../server';

describe('Withdraw funds from wallet test cases', () => {
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


  it('should withdraw funds from wallet', async () => {
    await request(server).post('/v1/api/wallet/fund').send({
      id,
      amount: 500,
    });
    const res = await request(server).post('/v1/api/wallet/withdraw').send({
      id,
      amount: 200,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 300);
  });

  it('should withdraw funds from wallet by inactive user', async () => {
    const res = await request(server).post('/v1/api/wallet/withdraw').send({
      id,
      amount: 100,
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  
  it('should withdraw funds from inactive wallet', async () => {
    const res = await request(server).post('/v1/api/wallet/withdraw').send({
      id,
      amount: 100,
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
