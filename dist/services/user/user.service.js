"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_connection_1 = __importDefault(require("../../config/db.connection"));
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
const user_utils_1 = __importDefault(require("../../utils/user/user.utils"));
class UserService {
    async getUsers() {
        const users = await (0, db_connection_1.default)('users').returning('*');
        return users;
    }
    async getUser(id, next) {
        const [user] = await user_utils_1.default.getUserById(id);
        if (!user)
            return next(new AppError_1.AppError('User profile not found', 404));
        return user;
    }
    async deactivateUser(id, next) {
        const [user] = await user_utils_1.default.getUserById(id);
        if (!user)
            return next(new AppError_1.AppError('User profile not found', 404));
        const data = await user_utils_1.default.deactivateUser(id);
        return data;
    }
}
exports.UserService = UserService;
