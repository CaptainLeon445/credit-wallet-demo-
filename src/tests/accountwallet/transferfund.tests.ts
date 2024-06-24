import request from 'supertest';
import app from '../../testserver';
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4002, async () => {
  try {
    console.info(`Fund transfer test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Transfer funds through wallets test cases', () => {
  let id: number;
  let receiverId: number;
  let deactivatedId: number;
  let token: string;
  let deactivatedToken: string;
  let deactivatedWallet: string;

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
    const user2 = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris2',
      email: 'mrchris2@mail.uk',
      role: 'user',
      password: 'Password113#',
    });
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdev',
      email: 'mrchrisv@mail.uk',
      role: 'user',
      password: 'Password113#',
    });
    const user3 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdev',
      password: 'Password113#',
    });
  
    await request(server)
      .patch('/v1/api/wallet/deactivate')
      .set('Authorization', `Bearer ${user3.body.data['accessToken']}`);
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdel',
      email: 'mrchris2l@mail.uk',
      role: 'user',
      password: 'Password113#',
    });
    const user4 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdel',
      password: 'Password113#',
    });
    await request(server)
      .patch('/v1/api/profile/deactivate')
      .set('Authorization', `Bearer ${user4.body.data['accessToken']}`);

    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisdelw',
      email: 'mrchris2lw@mail.uk',
      role: 'user',
      password: 'Password113#',
    });
    const user5 = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisdelw',
      password: 'Password113#',
    });
    await request(server)
      .patch('/v1/api/wallet/deactivate')
      .set('Authorization', `Bearer ${user5.body.data['accessToken']}`);

    id = user.body.data["id"];
    receiverId = user2.body.data["id"];
    deactivatedId = user3.body.data["id"];
    deactivatedToken = user4.body.data['accessToken'];
    deactivatedWallet = user5.body.data['accessToken'];
    token = user.body.data['accessToken'];
  });

  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });

  it('should transfer fund to another user', async () => {
    await request(server)
      .post('/v1/api/wallet/fund')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id,
        amount: 100,
      });
    const res = await request(server)
      .post('/v1/api/wallet/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverWalletId: receiverId,
        amount: 50,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should transfer fund to another user from inactive account', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/transfer')
      .set('Authorization', `Bearer ${deactivatedToken}`)
      .send({
        receiverWalletId: receiverId,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should transfer fund to user with no record in the db', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverWalletId: 88,
        amount: 50,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should not transfer fund to inactive wallet', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverWalletId: deactivatedId,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should transfer fund from inactive wallet', async () => {
    const res = await request(server)
      .post('/v1/api/wallet/transfer')
      .set('Authorization', `Bearer ${deactivatedWallet}`)
      .send({ 
        receiverWalletId: receiverId,
        amount: 50,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
