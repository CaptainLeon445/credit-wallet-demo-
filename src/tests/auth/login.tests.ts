import request from 'supertest';
import server from '../../server';

describe('Login Endpoints', () => {
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });

    await request(server).post('/v1/api/auth/register').send({
      username: 'deactivatedAcc',
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });

    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'deactivatedAcc',
      password: 'Password123#',
    });

    await request(server).post('/v1/api/account/deactivate');
  });

  it('should login user', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'fail');
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
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'deactivatedAcc',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });

  it('should try login with invalid password', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris4',
      password: 'paword123',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
