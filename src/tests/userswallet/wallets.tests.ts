import request from 'supertest';
import app from '../../testserver';
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4009, async () => {
  try {
    console.info(`Wallets test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

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
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Password123#',
    });
    
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletusertst',
      email: 'walletusertst@mail.io',
      role: 'user',
      password: 'Password123#',
    });
   

    token = user.body.data['accessToken'];
    const wallet = await request(server)
      .get('/v1/api/wallets')
      .set('Authorization', `Bearer ${token}`);
    id = wallet.body.data[0]["id"];
  });
  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });
  it('should get users wallet', async () => {
    const res = await request(server)
      .get('/v1/api/wallets')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate user wallet', async () => {
    const res = await request(server)
      .patch(`/v1/api/wallets/${id}/deactivate`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should activate user wallet', async () => {
    const res = await request(server)
      .patch(`/v1/api/wallets/${id}/activate `)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
