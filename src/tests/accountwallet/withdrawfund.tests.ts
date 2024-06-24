import request from 'supertest';
import server from '../../server';

describe('Withdraw funds from wallet test cases', () => {
  let token: string;
  let token1: string;
  let token2: string;

  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'Password123',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Password123',
    });
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser1',
      email: 'walletuser1@mail.io',
      password: 'Passsword123#',
    });
    const user1 = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser1',
      password: 'Passsword123#',
    });
    await request(server)
      .post('/v1/api/account/deactivate')
      .set('Authorization', `Bearer ${user1.body.accessToken}`);
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser2',
      email: 'walletuser@mail.io',
      password: 'Passsword123#',
    });
    const user2 = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser2',
      password: 'Passsword123#',
    });
    await request(server)
      .post('/v1/api/wallet/deactivate')
      .set('Authorization', `Bearer ${user2.body.accessToken}`);
    token = user.body.accessToken;
    token1 = user1.body.accessToken;
    token2 = user.body.accessToken;
  });

  it('should withdraw funds from wallet', async () => {
    await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/fund')
      .send({
        amount: 500,
      });
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallet/withdraw')
      .send({
        amount: 200,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 300);
  });

  it('should withdraw funds from wallet by inactive user', async () => {
    await request(server)
      .set('Authorization', `Bearer ${token1}`)
      .post('/v1/api/wallet/fund')
      .send({
        amount: 500,
      });
    const res = await request(server)
      .set('Authorization', `Bearer ${token1}`)
      .post('/v1/api/wallet/withdraw')
      .send({
        amount: 100,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should withdraw funds from inactive wallet', async () => {
    await request(server)
      .set('Authorization', `Bearer ${token2}`)
      .post('/v1/api/wallet/fund')
      .send({
        amount: 500,
      });
    const res = await request(server)
      .set('Authorization', `Bearer ${token2}`)
      .post('/v1/api/wallet/withdraw')
      .send({
        amount: 100,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
