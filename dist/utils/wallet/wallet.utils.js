"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = __importDefault(require("../../config/db.connection"));
class WalletUtils {
    static async getWalletByUId(uid) {
        const [wallet] = await (0, db_connection_1.default)("wallets").where({ uid }).returning("*");
        return wallet;
    }
    static async getWalletById(id) {
        const [wallet] = await (0, db_connection_1.default)("wallets").where({ id }).returning("*");
        return wallet;
    }
    static async deactivateWallet(id) {
        const [updatedWallet] = await (0, db_connection_1.default)("wallets")
            .update({ active: false })
            .where({ id })
            .returning("*");
        return updatedWallet;
    }
}
exports.default = WalletUtils;
