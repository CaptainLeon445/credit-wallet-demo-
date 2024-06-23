"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = void 0;
const db_connection_1 = __importDefault(require("../config/db.connection"));
const userTable = async () => {
    await db_connection_1.default.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.boolean("active").defaultTo(true);
        table.timestamps(true, true);
    });
};
exports.userTable = userTable;
