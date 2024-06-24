"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Users wallets test cases', () => {
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
    it('should get users wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/v1/api/wallets');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate user wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default).patch(`/v1/api/wallets/${id}/deactivate`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should activate user wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default).patch(`/v1/api/wallets/${id}/activate `);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
});
