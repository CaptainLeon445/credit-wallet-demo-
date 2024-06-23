import db from "../config/db.connection";

const userTable = async () => {
  await db.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
};

export { userTable };
