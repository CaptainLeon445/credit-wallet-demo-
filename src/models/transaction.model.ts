import db from '../config/db.connection';

const transactionTable = async () => {
  await db.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('uid').unsigned().notNullable().references('id').inTable('users');
    table.integer('walletId').unsigned().notNullable().references('id').inTable('wallets');
    table.decimal('amount', 14, 2).defaultTo(0);
    table.enum('type', ['credit', 'debit']).notNullable();
    table.text('description').defaultTo('');
    table.timestamps(true, true);
  });
};

export { transactionTable };
