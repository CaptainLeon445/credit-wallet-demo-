"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Transfer funds through wallets test cases', () => {
    let id;
    let aid;
    let deactivatedId;
    let token;
    let deactivatedToken;
    let deactivatedWallet;
    beforeAll(async () => {
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            password: 'Password113#',
        });
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'Password113#',
        });
        const user2 = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris2',
            email: 'mrchris2@mail.uk',
            password: 'password123',
        });
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchrisdev',
            email: 'mrchrisv@mail.uk',
            password: 'password123',
        });
        const user3 = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchrisdev',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server_1.default)
            .post('/v1/api/account/deactivate')
            .set('Authorization', `Bearer ${user3.body.accessToken}`);
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchrisdel',
            email: 'mrchris2l@mail.uk',
            password: 'password123',
        });
        const user4 = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchrisdel',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server_1.default)
            .post('/v1/api/account/deactivate')
            .set('Authorization', `Bearer ${user4.body.accessToken}`);
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchrisdelw',
            email: 'mrchris2lw@mail.uk',
            password: 'password123',
        });
        const user5 = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchrisdelw',
            password: 'Password113#',
        });
        await (0, supertest_1.default)(server_1.default)
            .post('/v1/api/wallets/deactivate')
            .set('Authorization', `Bearer ${user5.body.accessToken}`);
        id = user.body.id;
        aid = user2.body.id;
        deactivatedId = user3.body.id;
        deactivatedToken = user4.body.accessToken;
        deactivatedWallet = user5.body.accessToken;
        token = user.body.accessToken;
    });
    it('should transfer fund to another user', async () => {
        await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/wallet/fund')
            .send({
            id,
            amount: 100,
        });
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/wallet/transfer')
            .send({
            receiverWalletId: aid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('balance', 50);
    });
    it('should transfer fund to another user from inactive account', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${deactivatedToken}`)
            .post('/v1/api/wallet/transfer')
            .send({
            receiverWalletId: aid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should transfer fund to user with no record in the db', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/wallet/transfer')
            .send({
            receiverWalletId: 88,
            amount: 50,
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should transfer fund to inactive wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/wallet/transfer')
            .send({
            receiverWalletId: deactivatedId,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should transfer fund from inactive wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${deactivatedWallet}`)
            .post('/v1/api/wallet/transfer')
            .send({
            receiverWalletId: aid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
