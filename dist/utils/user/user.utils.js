"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = __importDefault(require("../../config/db.connection"));
class UserUtils {
    static async getUserById(id) {
        const [user] = await (0, db_connection_1.default)("users").where({ id }).returning("*");
        return user;
    }
    static async getUserByUsername(username) {
        const [user] = await (0, db_connection_1.default)("users").where({ username }).returning("*");
        return user;
    }
    static async deactivateUser(id) {
        const [updatedUser] = await (0, db_connection_1.default)("users")
            .update({ active: false })
            .where({ id })
            .returning("*");
        return updatedUser;
    }
}
exports.default = UserUtils;
