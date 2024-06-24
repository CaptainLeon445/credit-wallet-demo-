import request from 'supertest';
import app from '../../testserver';
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4001, async () => {
  try {
    console.info(`Fund wallet test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Fund wallet test cases', () => {
  let token: string;
  let token1: string;
  let token2: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      role: 'user',
      password: 'Passsword123#',
    });
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser',
      password: 'Passsword123#',
    });

    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser1',
      email: 'walletuser1@mail.io',
      role: 'user',
      password: 'Passsword123#',
    });
    const user1 = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser1',
      password: 'Passsword123#',
    });
    await request(server)
      .patch('/v1/api/profile/deactivate')
      .set('Authorization', `Bearer ${user1.body.data['accessToken']}`);

    await request(server).post('/v1/api/auth/register').send({
      username: 'walletuser2',
      email: 'walletuser2@mail.io',
      role: 'user',
      password: 'Passsword123#',
    });
    const user2 = await request(server).post('/v1/api/auth/login').send({
      username: 'walletuser2',
      password: 'Passsword123#',
    });
    token2 = user2.body.data['accessToken'];
    await request(server)
      .patch('/v1/api/wallet/deactivate')
      .set('Authorization', `Bearer ${token2}`);

    token = user.body.data['accessToken'];
    token1 = user1.body.data['accessToken'];
  });

  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });

  it('should fund user wallet', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/fund')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 1000,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should fund wallet by inactive user', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/fund')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should fund inactive wallet', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/fund')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
