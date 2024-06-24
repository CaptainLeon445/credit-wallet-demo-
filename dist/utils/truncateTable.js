"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateAllTables = void 0;
const knex_1 = __importDefault(require("knex"));
const db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
});
const truncateAllTables = async () => {
    try {
        const tables = await db.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);
        const tableNames = tables.rows.map((row) => row.tablename);
        // Truncate all tables
        for (const table of tableNames) {
            await db.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
        }
    }
    catch (error) {
        console.error('Error truncating tables:', error);
    }
    finally {
        await db.destroy();
    }
};
exports.truncateAllTables = truncateAllTables;
