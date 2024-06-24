import request from 'supertest';
import server from '../../server';

describe('Auth Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should not create a user with existing email', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris1',
      email: 'mrchris1@mail.uk',
      password: 'password123',
    });
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris1@mail.uk',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('fail');
  });

  it('should not create a user with existing username', async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris1',
      email: 'mrchris1@mail.uk',
      password: 'password123',
    });
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris4',
      email: 'mrchris2@mail.uk',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('fail');
  });

  it('should not create a user with invalid password', async () => {
    const res = await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris4',
      email: 'mrchris4@mail.uk',
      password: 'paword123',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('fail');
  });
});
