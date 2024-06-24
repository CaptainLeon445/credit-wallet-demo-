import request from 'supertest';
import app from "../../testserver"
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4005, async () => {
  try {
    console.info(`Register test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Auth Endpoints', () => {
  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });
  it('should create a new user', async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris99',
      email: 'mrchris99@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should not create a user with existing email', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris11',
      email: 'mrchris1@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris77',
      email: 'mrchris1@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status','fail');
  });

  it('should not create a user with existing username', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris44',
      email: 'mrchris40@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris44',
      email: 'mrchris41@mail.uk',
      role: 'user',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should not create a user with invalid password', async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris245',
      email: 'mrchris484@mail.uk',
      role: 'user',
      password: 'paword123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
