"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Wallet Endpoints', () => {
    let token;
    beforeAll(async () => {
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            password: 'password113',
        });
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'password113',
        });
        token = user.body.accessToken;
    });
    it('should get your wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .get(`/v1/api/wallet`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate your wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .patch(`/v1/api/wallet/deactivate`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should activate your wallet', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .patch(`/v1/api/wallet/activate `);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
});
