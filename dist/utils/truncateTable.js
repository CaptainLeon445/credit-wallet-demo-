"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = exports.truncateAllTables = void 0;
const db_connection_1 = __importDefault(require("../config/db.connection"));
const transaction_model_1 = require("../models/transaction.model");
const user_model_1 = require("../models/user.model");
const wallet_model_1 = require("../models/wallet.model");
const truncateAllTables = async () => {
    try {
        const tables = await db_connection_1.default.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);
        const tableNames = tables.rows.map((row) => row.tablename);
        // Truncate all tables
        for (const table of tableNames) {
            await db_connection_1.default.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
        }
    }
    catch (error) {
        console.error('Error truncating tables:', error);
    }
    finally {
        await db_connection_1.default.destroy();
    }
};
exports.truncateAllTables = truncateAllTables;
const createTables = async () => {
    await db_connection_1.default.schema.dropTableIfExists('users');
    await db_connection_1.default.schema.dropTableIfExists('wallets');
    await db_connection_1.default.schema.dropTableIfExists('transactions');
    await (0, user_model_1.userTable)();
    await (0, wallet_model_1.walletTable)();
    await (0, transaction_model_1.transactionTable)();
};
exports.createTables = createTables;
