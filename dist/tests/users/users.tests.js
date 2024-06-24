"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4008, async () => {
    try {
        console.info(`Users test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Users Endpoints', () => {
    let id;
    let token;
    let token0;
    beforeAll(async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            role: 'superadmin',
            password: 'Password123#',
        });
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'walletuser1',
            email: 'walletuser1@mail.io',
            role: 'user',
            password: 'Password123#',
        });
        const user = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'Password123#',
        });
        const user0 = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'walletuser1',
            password: 'Password123#',
        });
        token0 = user0.body.data['accessToken'];
        token = user.body.data['accessToken'];
        id = user.body.data['id'];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should get users with non-superadmin role', async () => {
        const res = await (0, supertest_1.default)(server)
            .get('/v1/api/users')
            .set('Authorization', `Bearer ${token0}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should get users with superadmin role', async () => {
        const res = await (0, supertest_1.default)(server)
            .get('/v1/api/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate user', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/users/${id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate inactive user', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/users/${id}/deactivate`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should deactivate user with no record in the db', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch(`/v1/api/users/${88}/deactivate`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
