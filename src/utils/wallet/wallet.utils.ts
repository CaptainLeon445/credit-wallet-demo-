import db from "../../config/db.connection";

export default class WalletUtils {
  static async getWalletById(id: number) {
    const [wallet] = await db("wallets").where({ id }).returning("*");
    return wallet;
  }

  static async deactivateWallet(id: number) {
    const [updatedWallet] = await db("wallets")
      .update({ active: false })
      .where({ id })
      .returning("*");
    return updatedWallet;
  }
}
