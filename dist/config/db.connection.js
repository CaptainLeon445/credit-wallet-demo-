"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config = {
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
};
const db = (0, knex_1.default)({
    client: 'pg',
    connection: `postgres://${config.user}:${config.password}@${config.host}/${config.name}?ssl=true`,
});
exports.default = db;
