"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_utils_1 = require("../../utils/global.utils");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const auth_utils_1 = __importDefault(require("../../utils/auth/auth.utils"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
        /**
         * Register
         */
        this.register = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const userData = req.body;
            const data = await this.authService.createUser(userData, next);
            if (data) {
                await global_utils_1.GlobalUtilities.response(res, "Account created successfully", 201, data);
            }
        });
        /**
         * Login
         */
        this.login = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const loginData = req.body;
            const user = await this.authService.login(loginData, next);
            if (user) {
                const data = await auth_utils_1.default.getLoginData(req, user);
                await global_utils_1.GlobalUtilities.response(res, "User logged in successfully.", 201, data);
            }
        });
    }
}
exports.default = AuthController;
