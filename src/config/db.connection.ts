import knex from 'knex';

const config = {
    name: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    host: process.env.DATABASE_HOST!,
  }

const db = knex({
  client: 'pg',
  connection:`postgres://${config.user}:${config.password}@${config.host}/${config.name}?ssl=true`,
}); 

export default db;
