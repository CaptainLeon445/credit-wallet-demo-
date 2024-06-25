import knex from 'knex';
import { transactionTable } from '../models/transaction.model';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
});

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
  await db.schema.dropTableIfExists('transactions'); // Drop existing table
  await transactionTable();
};

