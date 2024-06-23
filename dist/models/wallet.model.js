"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletTable = void 0;
const db_connection_1 = __importDefault(require("../config/db.connection"));
const walletTable = async () => {
    await db_connection_1.default.schema.createTable("wallets", (table) => {
        table.increments("id").primary();
        table.integer("uid").unsigned().references("id").inTable("users");
        table.decimal("balance", 14, 2).defaultTo(0);
        table.boolean("active").defaultTo(true);
        table.timestamps(true, true);
    });
};
exports.walletTable = walletTable;
