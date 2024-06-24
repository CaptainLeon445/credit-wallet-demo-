"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4005, async () => {
    try {
        console.info(`Register test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Auth Endpoints', () => {
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should create a new user', async () => {
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris99',
            email: 'mrchris99@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should not create a user with existing email', async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris11',
            email: 'mrchris1@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris77',
            email: 'mrchris1@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should not create a user with existing username', async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris44',
            email: 'mrchris40@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris44',
            email: 'mrchris41@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('status', 'fail');
    });
    it('should not create a user with invalid password', async () => {
        const res = await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchris245',
            email: 'mrchris484@mail.uk',
            role: 'user',
            password: 'paword123',
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
