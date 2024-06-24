import request from 'supertest';
import server from '../../server';

describe('Profile Endpoints', () => {
  it('should get user profile details', async () => {
    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchris',
      password: 'Password123#',
    });
    const res = await request(server).get('/v1/api/profile');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
  });

  it('should deactivate user', async () => {
    const res = await request(server).post('/v1/api/profile/deactivate');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success');
  });

  it('should deactivate inactive user', async () => {
    const res = await request(server).post('/v1/api/profile/deactivate');
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('fail');
  });
});
