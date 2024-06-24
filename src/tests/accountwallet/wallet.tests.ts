import request from 'supertest';
import server from '../../server';

describe('Wallet Endpoints', () => {
  let token: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'password113',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'password113',
    });

    token = user.body.accessToken;
  });

  it('should get your wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .get(`/v1/api/wallet`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate your wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .patch(`/v1/api/wallet/deactivate`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should activate your wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .patch(`/v1/api/wallet/activate `);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
