import request from 'supertest';
import app from '../../testserver';
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4004, async () => {
  try {
    console.info(`Login test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Login Endpoints', () => {
  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });
  it('should login user', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should login with invalid username', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'fakechris',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should try inactive account', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'deactivatedAcc',
      email: 'mrchris77@mail.uk',
      role: 'user',
      password: 'Password123#',
    });

    const obj = await request(server).post('/v1/api/auth/login').send({
      username: 'deactivatedAcc',
      password: 'Password123#',
    });

    await request(server)
      .patch('/v1/api/profile/deactivate')
      .set('Authorization', `Bearer ${obj.body.data['accessToken']}`);
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'deactivatedAcc',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should try login with invalid password', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      role: 'user',
      password: 'Password123#',
    });

    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris',
      password: 'paword123',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status', 'fail');
  });

});
