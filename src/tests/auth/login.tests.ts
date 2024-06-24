import request from 'supertest';
import server from '../../server';

describe('Login Endpoints', () => {
  it('should login user', async () => {
    await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });
    const res = await request(server).post('/v1/api/auth/login').send({
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login with invalid username', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'fakechris',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('fail');
  });

  it('should try inactive account', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'deactivatedAcc',
      password: 'Password123#',
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('fail');
  });

  it('should try login with invalid password', async () => {
    const res = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris4',
      password: 'paword123',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('fail');
  });
});
