import request from 'supertest';
import server from '../../server';

describe('Fund wallet test cases', () => {
  let id: number;
  let token: string;
  let token1: string;
  let token2: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'Passsword123#',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Passsword123#',
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
      .post('/v1/api/wallets/deactivate')
      .set('Authorization', `Bearer ${user2.body.accessToken}`);
    id = user.body.id;
    token = user.body.accessToken;
    token1 = user1.body.accessToken;
    token2 = user2.body.accessToken;
  });

  it('should fund user wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/wallets/fund')
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 1000);
  });

  it('should fund wallet by inactive user', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token1}`)
      .post('/v1/api/wallets/fund')
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should fund inactive wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token2}`)
      .post('/v1/api/wallets/fund')
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
