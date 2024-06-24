"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
describe('Transfer funds through wallets test cases', () => {
    let id;
    let token;
    beforeAll(async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'walletuser',
            email: 'walletuser@mail.io',
            password: 'password113',
        });
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/login').send({
            username: 'walletuser',
            password: 'password113',
        });
        id = user.body.id;
        token = user.body.accessToke;
    });
    it('should transfer fund to another user', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris2',
            email: 'mrchris2@mail.uk',
            password: 'password123',
        });
        const toUid = user.body.id;
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/fund`).send({
            id,
            amount: 100,
        });
        const res = await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/transfer`).send({
            toUid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('balance', 50);
    });
    it('should transfer fund to another user from inactive account', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris22',
            email: 'mrchris22@mail.uk',
            password: 'password123',
        });
        const toUid = user.body.id;
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/fund`).send({
            id: aid,
            amount: 100,
        });
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/users/${id}/deactivate`);
        const res = await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/transfer`).send({
            toUid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', "fail");
    });
    it('should transfer fund to user with no record in the db', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/transfer`).send({
            fromUid: aid,
            toUid: 88,
            amount: 50,
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('status', "fail");
    });
    it('should transfer fund to inactive wallet', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris222',
            email: 'mrchris222@mail.uk',
            password: 'password123',
        });
        const toUid = user.body.id;
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${wid}/fund`).send({
            id: aid,
            amount: 100,
        });
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/${toUid}/deactivate`);
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallets/transfer').send({
            fromUid: aid,
            toUid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', "fail");
    });
    it('should transfer fund from inactive wallet', async () => {
        const user = await (0, supertest_1.default)(server_1.default).post('/v1/api/auth/register').send({
            username: 'mrchris2222',
            email: 'mrchris2222@mail.uk',
            password: 'password123',
        });
        const toUid = user.body.id;
        await (0, supertest_1.default)(server_1.default).post('/v1/api/wallets/fund').send({
            id: aid,
            amount: 100,
        });
        await (0, supertest_1.default)(server_1.default).post(`/v1/api/wallets/{id}/deactivate`);
        const res = await (0, supertest_1.default)(server_1.default).post('/v1/api/wallets/transfer').send({
            fromUid: aid,
            toUid,
            amount: 50,
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('status', "fail");
    });
});