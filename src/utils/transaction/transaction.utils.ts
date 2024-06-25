import db from '../../config/db.connection';

export default class TransactionUtils {
  static async getTransactionById(id: number) {
    const [transaction] = await db('transactions').where({ id }).returning('*');
    return transaction;
  }

  static async getTransactionsByUser(uid: number) {
    const transactions = await db('transactions').where({ uid }).returning('*');
    return transactions;
  }
}
