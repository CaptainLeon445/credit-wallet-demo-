"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_utils_1 = require("../../utils/global.utils");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getUsers = (0, catchAsyncError_1.catchAsync)(async (req, res) => {
            const data = await this.userService.getUsers();
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Users returned successfully', 200, data, data.length);
        });
        this.getUser = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                id = user.id;
            }
            const data = await this.userService.getUser(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'User details returned successfully!', 200, data);
        });
        this.deactivateUser = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else
                id = user.id;
            const data = await this.userService.deactivateUser(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'User deactivated successfully!', 201, data);
        });
    }
}
exports.default = UserController;
