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
        table
            .integer('uid')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('walletId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('wallets')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('receiverId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table
            .integer('senderId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.decimal('amount', 14, 2).defaultTo(0);
        table.enum('type', ['credit', 'debit']).notNullable();
        table.text('description').defaultTo('');
        table.timestamps(true, true);
    });
};
exports.transactionTable = transactionTable;
