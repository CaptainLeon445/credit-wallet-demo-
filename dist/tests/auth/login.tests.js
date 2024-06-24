"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Login Endpoints', () => {
    it('should login user', async () => {
        await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchris',
            email: 'mrchris@mail.uk',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            email: 'mrchris@mail.uk',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });
    it('should login with invalid username', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'fakechris',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('fail');
    });
    it('should try inactive account', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'deactivatedAcc',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('fail');
    });
    it('should try login with invalid password', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'mrchris4',
            password: 'paword123',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('fail');
    });
});
