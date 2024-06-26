"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthUtilities {
    static async verifyAuthToken(token, secret) {
        return jwt.verify(token, secret);
    }
    static async generateHash(text) {
        const saltRounds = 10;
        const hashedPassword = bcrypt_1.default.hashSync(text, saltRounds);
        return hashedPassword;
    }
    static async validateHash(text, hash) {
        return bcrypt_1.default.compare(text, hash);
    }
    static async validatePasswordLength(password) {
        const passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;
        if (!passwordRegExp.test(password)) {
            return false;
        }
        return true;
    }
    static async getLoginData(req, user) {
        const accessToken = await AuthUtilities.getAuthToken(user.id);
        const refreshToken = await AuthUtilities.getRefreshAuthToken(user.id);
        delete user.password;
        const data = {
            accessToken,
            refreshToken,
            ...user,
        };
        return data;
    }
    static async getRefreshAuthToken(id) {
        const expiresIn = process.env.JWT_RefreshToken_ExpiresIn;
        const result = await this.getToken(expiresIn, id);
        return result;
    }
    static async getAuthToken(id) {
        const expiresIn = process.env.JWT_ExpiresIn;
        const result = await this.getToken(expiresIn, id);
        return result;
    }
    static async getToken(expiryTime, id) {
        const secret = process.env.JWT_SECRET_KEY;
        const expiresIn = expiryTime;
        const token = jwt.sign({ id }, secret, {
            expiresIn: expiresIn,
        });
        return token;
    }
}
exports.default = AuthUtilities;
