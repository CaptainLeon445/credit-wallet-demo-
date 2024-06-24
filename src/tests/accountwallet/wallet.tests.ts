import request from 'supertest';
import server from '../../server';

describe('Wallet Endpoints', () => {
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

  it('should get your wallet', async () => {
    const res = await request(server).get(`/v1/api/wallets/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate your wallet', async () => {
    const res = await request(server).patch(`/v1/api/wallets/${id}/deactivate`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should activate your wallet', async () => {
    const res = await request(server).patch(`/v1/api/wallets/${id}/activate `);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});