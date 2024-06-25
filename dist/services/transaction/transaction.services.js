"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const db_connection_1 = __importDefault(require("../../config/db.connection"));
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
const transaction_utils_1 = __importDefault(require("../../utils/transaction/transaction.utils"));
class TransactionService {
    async createTransaction(data, next) {
        try {
            const transaction = await (0, db_connection_1.default)('transactions').insert(data).returning('*');
            return transaction;
        }
        catch (error) {
            return next(new AppError_1.AppError(error.message, error.status));
        }
    }
    async getAllTransactions() {
        const transactions = await (0, db_connection_1.default)('transactions').returning('*');
        return transactions;
    }
    async getUserTransactions(uid, next) {
        const transactions = await transaction_utils_1.default.getTransactionsByUser(uid);
        if (transactions.length < 1)
            return next(new AppError_1.AppError('Data not found', 404));
        return transactions;
    }
    async getTransaction(id, next) {
        const transaction = await transaction_utils_1.default.getTransactionById(id);
        if (!transaction)
            return next(new AppError_1.AppError('Transaction details not found', 404));
        return transaction;
    }
}
exports.TransactionService = TransactionService;
