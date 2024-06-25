'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const testserver_1 = __importDefault(require('../../testserver'));
const logger_1 = __importDefault(require('../../logger'));
const truncateTable_1 = require('../../utils/truncateTable');
const server = testserver_1.default.listen(4001, async () => {
  try {
    console.info(`Test server working successfully.`);
  } catch (error) {
    logger_1.default.error(error.message);
  }
});
describe('Fund wallet test cases', () => {
  let id;
  let token;
  let token1;
  let token2;
  beforeAll(async () => {
    await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
      username: 'walletuser',
      email: 'walletuser@mail.io',
      password: 'Passsword123#',
    });
    const user = await (0, supertest_1.default)(server)
      .post('/v1/api/auth/login')
      .send({
        username: 'walletuser',
        password: 'Passsword123#',
      });
    await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
      username: 'walletuser1',
      email: 'walletuser1@mail.io',
      password: 'Passsword123#',
    });
    const user1 = await (0, supertest_1.default)(server)
      .post('/v1/api/auth/login')
      .send({
        username: 'walletuser1',
        password: 'Passsword123#',
      });
    await (0, supertest_1.default)(server)
      .post('/v1/api/account/deactivate')
      .set('Authorization', `Bearer ${user1.body.data['accessToken']}`);
    await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
      username: 'walletuser2',
      email: 'walletuser@mail.io',
      password: 'Passsword123#',
    });
    const user2 = await (0, supertest_1.default)(server)
      .post('/v1/api/auth/login')
      .send({
        username: 'walletuser2',
        password: 'Passsword123#',
      });
    await (0, supertest_1.default)(server)
      .post('/v1/api/wallets/deactivate')
      .set('Authorization', `Bearer ${user2.body.data['accessToken']}`);
    id = user.body.id;
    token = user.body.data['accessToken'];
    token1 = user1.body.data['accessToken'];
    token2 = user2.body.data['accessToken'];
  });
  afterAll(async () => {
    await (0, truncateTable_1.truncateAllTables)();
    server.close();
  });
  it('should fund user wallet', async () => {
    const res = await (0, supertest_1.default)(server)
      .post('/v1/api/wallets/fund')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('balance', 1000);
  });
  it('should fund wallet by inactive user', async () => {
    const res = await (0, supertest_1.default)(server)
      .post('/v1/api/wallets/fund')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
  it('should fund inactive wallet', async () => {
    const res = await (0, supertest_1.default)(server)
      .post('/v1/api/wallets/fund')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        id,
        amount: 1000,
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
