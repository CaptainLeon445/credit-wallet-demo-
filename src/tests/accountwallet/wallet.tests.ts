import request from 'supertest';
import app from '../../testserver';
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4003, async () => {
  try {
    console.info(`Wallet test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Wallet Endpoints', () => {
  let token: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      role: 'user',
      password: 'Password113#',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Password113#',
    });
    token = user.body.data['accessToken'];
  });

  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });

  it('should get your wallet', async () => {
    const res = await request(server)
      .get(`/v1/api/wallet`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate your wallet', async () => {
    const res = await request(server)
      .patch(`/v1/api/wallet/deactivate`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should activate your wallet', async () => {
    const res = await request(server)
      .patch(`/v1/api/wallet/activate `)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
