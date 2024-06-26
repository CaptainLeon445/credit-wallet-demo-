"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionTable = void 0;
const db_connection_1 = __importDefault(require("../config/db.connection"));
const transactionTable = async () => {
    await db_connection_1.default.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('uid').unsigned().references('id').inTable('users');
        table.integer('wallet_id').unsigned().references('id').inTable('wallets');
        table.decimal('amount', 14, 2).defaultTo(0);
        table.enum('type', ['credit', 'debit']).notNullable();
        table.text('description').defaultTo('');
        table.timestamps(true, true);
    });
};
exports.transactionTable = transactionTable;
