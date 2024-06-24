"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4000, async () => {
    try {
        console.info(`Fund withdrawal test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Withdraw funds from wallet test cases', () => {
    let token;
    let token1;
    let token2;
    beforeAll(async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuu',
            email: 'walletuser@mail.io',
            role: 'user',
            password: 'Password123#',
        });
        const user = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuu',
            password: 'Password123#',
        });
        token = user.body.data['accessToken'];
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser1',
            email: 'walletuser1@mail.io',
            role: 'user',
            password: 'Passsword123#',
        });
        const user1 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser1',
            password: 'Passsword123#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/profile/deactivate')
            .set('Authorization', `Bearer ${user1.body.data['accessToken']}`);
        token1 = user1.body.data['accessToken'];
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser2',
            email: 'walletuser2@mail.io',
            role: 'user',
            password: 'Passsword123#',
        });
        const user2 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser2',
            password: 'Passsword123#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/wallet/deactivate')
            .set('Authorization', `Bearer ${user2.body.data['accessToken']}`);
        token2 = user2.body.data['accessToken'];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should withdraw funds from wallet', async () => {
        await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/fund')
            .set('Authorization', `Bearer ${token}`)
            .send({
            amount: 500,
        });
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/withdraw')
            .set('Authorization', `Bearer ${token}`)
            .send({
            amount: 200,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should withdraw funds from wallet by inactive user', async () => {
        await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/fund')
            .set('Authorization', `Bearer ${token1}`)
            .send({
            amount: 500,
        });
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/withdraw')
            .set('Authorization', `Bearer ${token1}`)
            .send({
            amount: 100,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should not withdraw funds from inactive wallet', async () => {
        await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/fund')
            .set('Authorization', `Bearer ${token2}`)
            .send({
            amount: 500,
        });
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/withdraw')
            .set('Authorization', `Bearer ${token2}`)
            .send({
            amount: 100,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
