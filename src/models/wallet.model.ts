import db from '../config/db.connection';

const walletTable = async () => {
  await db.schema.createTable('wallets', (table) => {
    table.increments('id').primary();
    
    table.integer('uid').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE').onUpdate('CASCADE');
    
    table.decimal('balance', 14, 2).defaultTo(0);
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });
};

export { walletTable };

