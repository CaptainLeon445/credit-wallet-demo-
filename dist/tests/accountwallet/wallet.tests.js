"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4003, async () => {
    try {
        console.info(`Wallet test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Wallet Endpoints', () => {
    let token;
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
        token = user.body.data['accessToken'];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should get your wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .get(`/v1/api/wallet`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate your wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/wallet/deactivate`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should activate your wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/wallet/activate `)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
});
