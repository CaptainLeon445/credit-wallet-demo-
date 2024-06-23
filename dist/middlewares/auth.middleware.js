"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AppError_1 = require("./ErrorHandlers/AppError");
const auth_utils_1 = __importDefault(require("../utils/auth/auth.utils"));
const logger_1 = __importDefault(require("../logger"));
const user_utils_1 = __importDefault(require("../utils/user/user.utils"));
class AuthMiddleware {
    constructor() {
        this.verifyAndDecodeToken = async (token, secretKey) => {
            return await auth_utils_1.default.verifyAuthToken(token, secretKey);
        };
        this.getAccessToken = async (req, next) => {
            const authHeader = req.headers.authorization?.split(" ");
            const bearer = authHeader && authHeader[0];
            if (bearer !== "Bearer")
                return next(new AppError_1.AppError("You are not authorized", 401));
            const accessToken = authHeader && authHeader[1];
            if (!accessToken)
                return next(new AppError_1.AppError("You are not authorized", 401));
            return accessToken;
        };
        this.getUserFromToken = async (id) => {
            return user_utils_1.default.getUserById(id);
        };
    }
    async authProtect(req, res, next) {
        try {
            const accessToken = await this.getAccessToken(req, next);
            if (accessToken) {
                const decoded = await this.verifyAndDecodeToken(accessToken, process.env.JWT_SECRET_KEY);
                const user = await this.getUserFromToken(decoded.id);
                if (!user) {
                    return next(new AppError_1.AppError("You are not authorized", 401));
                }
                req.user = user;
                next();
            }
        }
        catch (error) {
            logger_1.default.error("Error", error.message);
            return next(new AppError_1.AppError("You are not authorized", 401));
        }
    }
    authRestrictTo(roles) {
        return (req, res, next) => {
            try {
                if (!roles.includes(req.user.role)) {
                    return next(new AppError_1.AppError("You do not have permission to perform this action.", 401));
                }
                next();
            }
            catch (err) {
                logger_1.default.error("error", err);
                return next(new AppError_1.AppError(err.message, err.status));
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
