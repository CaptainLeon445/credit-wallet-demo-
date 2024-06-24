import request from 'supertest';
import server from '../../server';

describe('Users wallets test cases', () => {
  let id: number;
  let token: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      role: 'superadmin',
      password: 'Password123#',
    });
    const user0 = await request(server).post('/v1/api/auth/register').send({
      username: 'walletusertst',
      email: 'walletusertst@mail.io',
      role: 'user',
      password: 'Password123#',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Password123#',
    });
    id = user0.body.id;
    token = user.body.accessToke;
  });
  it('should get users wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .get('/v1/api/wallets');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate user wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .patch(`/v1/api/wallets/${id}/deactivate`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should activate user wallet', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .patch(`/v1/api/wallets/${id}/activate `);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
