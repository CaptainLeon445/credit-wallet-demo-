"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Profile Endpoints', () => {
    let token;
    beforeAll(async () => {
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris',
            email: 'mrchris@mail.uk',
            password: 'Password123#',
        });
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchris',
            password: 'Password123#',
        });
        token = user.body.id;
    });
    it('should get user profile details', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .get('/v1/api/profile');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
    });
    it('should deactivate user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/profile/deactivate');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success');
    });
    it('should deactivate inactive user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .set('Authorization', `Bearer ${token}`)
            .post('/v1/api/profile/deactivate');
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('fail');
    });
});