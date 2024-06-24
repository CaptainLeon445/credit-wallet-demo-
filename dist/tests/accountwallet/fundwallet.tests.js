"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Fund wallet test cases', () => {
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
    it('should fund user wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallet/fund').send({
            id,
            amount: 1000,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('balance', 1000);
    });
    it('should fund wallet by inactive user', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallet/fund').send({
            id,
            amount: 1000,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should fund inactive wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallet/fund').send({
            id,
            amount: 1000,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
