import db from "../config/db.connection";

const walletTable = async () => {
  await db.schema.createTable("wallets", (table) => {
    table.increments("id").primary();
    table.integer("uid").unsigned().references("id").inTable("users");
    table.decimal("balance", 14, 2).defaultTo(0);
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
};

export { walletTable };
