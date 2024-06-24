"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Users Endpoints', () => {
    it('should get users with non-superadmin role', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchris',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server_1.default).get('/v1/api/users');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('fail');
    });
    it('should get users with superadmin role', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'superchris',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server_1.default).get('/v1/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
    });
    it('should deactivate user', async () => {
        const res = await (0, supertest_1.default)(server_1.default).patch(`/v1/api/users/${user.id}/deactivate`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success');
    });
    it('should deactivate inactive user', async () => {
        const res = await (0, supertest_1.default)(server_1.default).patch(`/v1/api/users/${user.id}/deactivate`);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('fail');
    });
    it('should deactivate user with no record in the db', async () => {
        const res = await (0, supertest_1.default)(server_1.default).patch(`/v1/api/users/${user.id}/deactivate`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('fail');
    });
});
