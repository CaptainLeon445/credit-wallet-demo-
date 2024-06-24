"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4009, async () => {
    try {
        console.info(`Wallets test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Users wallets test cases', () => {
    let id;
    let token;
    beforeAll(async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            role: 'superadmin',
            password: 'Password123#',
        });
        const user = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'Password123#',
        });
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletusertst',
            email: 'walletusertst@mail.io',
            role: 'user',
            password: 'Password123#',
        });
        token = user.body.data['accessToken'];
        const wallet = await (0, supertest_1.default)(server)
            .get('/v1/api/wallets')
            .set('Authorization', `Bearer ${token}`);
        id = wallet.body.data[0]["id"];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should get users wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .get('/v1/api/wallets')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate user wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/wallets/${id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should activate user wallet', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/wallets/${id}/activate `)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
});
