"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Transfer funds through wallets test cases', () => {
    let id;
    let token;
    beforeAll(async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            password: 'password113',
        });
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'password113',
        });
        id = user.body.id;
        token = user.body.accessToke;
    });
    it('should transfer funds between users', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris2',
            email: 'mrchris2@mail.uk',
            password: 'password123',
        });
        const toUid = user.body.id;
        await (0, supertest_1.default)(server_1.default).post('/v1/api/wallet/fund').send({
            id,
            amount: 100,
        });
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallet/transfer').send({
            fromUid: id,
            toUid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('balance', 50);
    });
});
