import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
}); 
export default db;
