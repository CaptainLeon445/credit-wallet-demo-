"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe("Auth Endpoints", () => {
    it("should create a new user", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/v1/api/auth/register").send({
            username: "mrchris",
            email: "mrchris@mail.uk",
            password: "password123",
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
    });
    it("should not create a user with existing email", async () => {
        await (0, supertest_1.default)(server_1.default).post("/v1/api/auth/register").send({
            username: "mrchris1",
            email: "mrchris1@mail.uk",
            password: "password123",
        });
        const res = await (0, supertest_1.default)(server_1.default).post("/v1/api/auth/register").send({
            username: "mrchris",
            email: "mrchris1@mail.uk",
            password: "password123",
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty("fail");
    });
});
