"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4002, async () => {
    try {
        console.info(`Fund transfer test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Transfer funds through wallets test cases', () => {
    let id;
    let receiverId;
    let deactivatedId;
    let token;
    let deactivatedToken;
    let deactivatedWallet;
    beforeAll(async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            role: 'user',
            password: 'Password113#',
        });
        const user = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'Password113#',
        });
        const user2 = await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris2',
            email: 'mrchris2@mail.uk',
            role: 'user',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchrisdev',
            email: 'mrchrisv@mail.uk',
            role: 'user',
            password: 'Password113#',
        });
        const user3 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchrisdev',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/wallet/deactivate')
            .set('Authorization', `Bearer ${user3.body.data['accessToken']}`);
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchrisdel',
            email: 'mrchris2l@mail.uk',
            role: 'user',
            password: 'Password113#',
        });
        const user4 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchrisdel',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/profile/deactivate')
            .set('Authorization', `Bearer ${user4.body.data['accessToken']}`);
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchrisdelw',
            email: 'mrchris2lw@mail.uk',
            role: 'user',
            password: 'Password113#',
        });
        const user5 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchrisdelw',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/wallet/deactivate')
            .set('Authorization', `Bearer ${user5.body.data['accessToken']}`);
        id = user.body.data["id"];
        receiverId = user2.body.data["id"];
        deactivatedId = user3.body.data["id"];
        deactivatedToken = user4.body.data['accessToken'];
        deactivatedWallet = user5.body.data['accessToken'];
        token = user.body.data['accessToken'];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should transfer fund to another user', async () => {
        await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/fund')
            .set('Authorization', `Bearer ${token}`)
            .send({
            amount: 100,
            description: 'Testing the withdraw test case',
        });
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/transfer')
            .set('Authorization', `Bearer ${token}`)
            .send({
            receiverWalletId: receiverId,
            amount: 50,
            description: 'Testing the withdraw test case',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should transfer fund to another user from inactive account', async () => {
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/transfer')
            .set('Authorization', `Bearer ${deactivatedToken}`)
            .send({
            receiverWalletId: receiverId,
            amount: 50,
            description: 'Testing the withdraw test case',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should transfer fund to user with no record in the db', async () => {
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/transfer')
            .set('Authorization', `Bearer ${token}`)
            .send({
            receiverWalletId: 88,
            amount: 50,
            description: 'Testing the withdraw test case',
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should not transfer fund to inactive wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/transfer')
            .set('Authorization', `Bearer ${token}`)
            .send({
            receiverWalletId: deactivatedId,
            amount: 50,
            description: 'Testing the withdraw test case',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should transfer fund from inactive wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .post('/v1/api/wallet/transfer')
            .set('Authorization', `Bearer ${deactivatedWallet}`)
            .send({
            receiverWalletId: receiverId,
            amount: 50,
            description: 'Testing the withdraw test case',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
