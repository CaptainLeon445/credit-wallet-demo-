"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = __importDefault(require("../../config/db.connection"));
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
const auth_utils_1 = __importDefault(require("../../utils/auth/auth.utils"));
const user_utils_1 = __importDefault(require("../../utils/user/user.utils"));
class AuthService {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async createUser(userDTO, next) {
        const { username, password, email } = userDTO;
        try {
            const [emailExist] = await (0, db_connection_1.default)('users').where({ email });
            if (emailExist)
                return next(new AppError_1.AppError('User with the email already exists', 409));
            const [user] = await (0, db_connection_1.default)('users').where({ username });
            if (user)
                return next(new AppError_1.AppError('User with the username already exists', 409));
            const strongPassword = await auth_utils_1.default.validatePasswordLength(password);
            if (!strongPassword)
                return next(new AppError_1.AppError('Password must be 8 characters long with a number,special character, lowercase and uppercase letter.', 400));
            userDTO.password = await auth_utils_1.default.generateHash(password);
            const [data] = await (0, db_connection_1.default)('users').insert(userDTO).returning('*');
            await this.walletService.createWallet({ uid: data.id }, next);
            delete data.password;
            return data;
        }
        catch (error) {
            return next(new AppError_1.AppError(error.message, error.status));
        }
    }
    async login(userData, next) {
        const user = await user_utils_1.default.getUserByUsername(userData.username);
        if (!user)
            return next(new AppError_1.AppError(`No account associated with the username ${userData.username}`, 404));
        if (!user.active)
            return next(new AppError_1.AppError(`Your account is inactive. Kindly activate your account.`, 403));
        const comparePassword = await auth_utils_1.default.validateHash(userData.password, user.password);
        if (!comparePassword)
            return next(new AppError_1.AppError(`Username or Password is incorrect.`, 401));
        return user;
    }
}
exports.default = AuthService;
