import { NextFunction } from 'express';
import db from '../../config/db.connection';
import { AppError } from '../../middlewares/ErrorHandlers/AppError';
import TransactionUtils from '../../utils/transaction/transaction.utils';

export class TransactionService {
  public async createTransaction(data: any, next: NextFunction) {
    try {
      const transaction = await db('transactions').insert(data).returning('*');
      return transaction;
    } catch (error: any) {
      return next(new AppError(error.message, error.status));
    }
  }

  public async getAllTransactions() {
    const transactions = await db('transactions').returning('*');
    return transactions;
  }

  public async getUserTransactions(uid: number, next: NextFunction) {
    const transactions = await TransactionUtils.getTransactionsByUser(uid);
    if (transactions.length < 1)
      return next(new AppError('Data not found', 404));
    return transactions;
  }

  public async getTransaction(id: number, next: NextFunction) {
    const transaction = await TransactionUtils.getTransactionById(id);
    if (!transaction)
      return next(new AppError('Transaction details not found', 404));
    return transaction;
  }
}
