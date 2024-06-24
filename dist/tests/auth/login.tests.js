"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4004, async () => {
    try {
        console.info(`Login test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Login Endpoints', () => {
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should login user', async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris',
            email: 'mrchris@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchris',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should login with invalid username', async () => {
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'fakechris',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should try inactive account', async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'deactivatedAcc',
            email: 'mrchris77@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const obj = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'deactivatedAcc',
            password: 'Password123#',
        });
        await (0, supertest_1.default)(server)
            .patch('/v1/api/profile/deactivate')
            .set('Authorization', `Bearer ${obj.body.data['accessToken']}`);
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'deactivatedAcc',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should try login with invalid password', async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris',
            email: 'mrchris@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchris',
            password: 'paword123',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
