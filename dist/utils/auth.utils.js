"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthUtilities {
    static async generateHash(text) {
        const saltRounds = 10;
        const hashedPassword = bcrypt_1.default.hashSync(text, saltRounds);
        return hashedPassword;
    }
    static async validateHash(text, hash) {
        return await bcrypt_1.default.compare(text, hash);
    }
    static async validatePasswordLength(password) {
        const passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;
        if (!passwordRegExp.test(password)) {
            return false;
        }
        return true;
    }
}
exports.default = AuthUtilities;
