import db from '../config/db.connection';
import { transactionTable } from '../models/transaction.model';
import { userTable } from '../models/user.model';
import { walletTable } from '../models/wallet.model';


export const truncateAllTables = async () => {
  try {
    const tables = await db.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    const tableNames = tables.rows.map((row: { tablename: string }) => row.tablename);

    // Truncate all tables
    for (const table of tableNames) {
      await db.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    await db.destroy();
  } 
};


export const createTables = async () => {
  await db.schema.dropTableIfExists('users');
  await db.schema.dropTableIfExists('wallets');
  await db.schema.dropTableIfExists('transactions');

  await userTable();
  await walletTable();
  await transactionTable();

};

