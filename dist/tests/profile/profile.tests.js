"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testserver_1 = __importDefault(require("../../testserver"));
const logger_1 = __importDefault(require("../../logger"));
const truncateTable_1 = require("../../utils/truncateTable");
const server = testserver_1.default.listen(4006, async () => {
    try {
        console.info(`Profile test cases starting 🧪🧪🧪`);
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
});
describe('Profile Endpoints', () => {
    let token;
    beforeAll(async () => {
        await (0, supertest_1.default)(server).post('/v1/api/auth/register').send({
            username: 'mrchrisy',
            email: 'mrchris@mail.uk',
            role: 'user',
            password: 'Password123#',
        });
        const user = await (0, supertest_1.default)(server).post('/v1/api/auth/login').send({
            username: 'mrchrisy',
            password: 'Password123#',
        });
        token = user.body.data["accessToken"];
    });
    afterAll(async () => {
        await (0, truncateTable_1.truncateAllTables)();
        server.close();
    });
    it('should get user profile details', async () => {
        const res = await (0, supertest_1.default)(server)
            .get('/v1/api/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate user', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch('/v1/api/profile/deactivate')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
    });
    it('should deactivate inactive user', async () => {
        const res = await (0, supertest_1.default)(server)
            .patch('/v1/api/profile/deactivate')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
