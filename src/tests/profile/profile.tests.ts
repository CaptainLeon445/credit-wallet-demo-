import request from 'supertest';
import server from '../../server';

describe('Profile Endpoints', () => {
  let token: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchris',
      email: 'mrchris@mail.uk',
      password: 'Password123#',
    });

    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris',
      password: 'Password123#',
    });
    token = user.body.id;
  });
  it('should get user profile details', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .get('/v1/api/profile');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
  });

  it('should deactivate user', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/profile/deactivate');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success');
  });

  it('should deactivate inactive user', async () => {
    const res = await request(server)
      .set('Authorization', `Bearer ${token}`)
      .post('/v1/api/profile/deactivate');
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('fail');
  });
});
