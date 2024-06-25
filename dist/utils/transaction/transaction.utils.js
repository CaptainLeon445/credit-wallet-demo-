"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = __importDefault(require("../../config/db.connection"));
class TransactionUtils {
    static async getTransactionById(id) {
        const [transaction] = await (0, db_connection_1.default)('transactions').where({ id }).returning('*');
        return transaction;
    }
    static async getTransactionsByUser(uid) {
        const transactions = await (0, db_connection_1.default)('transactions').where({ uid }).returning('*');
        return transactions;
    }
}
exports.default = TransactionUtils;
