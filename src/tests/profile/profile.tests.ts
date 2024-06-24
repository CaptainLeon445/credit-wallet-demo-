import request from 'supertest';
import app from "../../testserver"
import logger from '../../logger';
import { truncateAllTables } from '../../utils/truncateTable';

const server = app.listen(4006, async () => {
  try {
    console.info(`Profile test cases starting 🧪🧪🧪`);
  } catch (error: any) {
    logger.error(error.message);
  }
});

describe('Profile Endpoints', () => {
  let token: string;
  beforeAll(async () => {
    await request(server).post('/v1/api/auth/register').send({
      username: 'mrchrisy',
      email: 'mrchris@mail.uk',
      role: 'user',
      password: 'Password123#',
    });

    const user = await request(server).post('/v1/api/auth/login').send({
      username: 'mrchrisy',
      password: 'Password123#',
    });
    token = user.body.data["accessToken"];
  });

  afterAll(async () => {
    await truncateAllTables();
    server.close();
  });
  
  it('should get user profile details', async () => {
    const res = await request(server)
      .get('/v1/api/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate user', async () => {
    const res = await request(server)
      .patch('/v1/api/profile/deactivate')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should deactivate inactive user', async () => {
    const res = await request(server)
      .patch('/v1/api/profile/deactivate')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
