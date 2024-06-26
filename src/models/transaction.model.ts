import db from '../config/db.connection';

const transactionTable = async () => {
  await db.schema.createTable('transactions', (table) => {
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

export { transactionTable };
