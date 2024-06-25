"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_utils_1 = require("../../utils/global.utils");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.getTransactions = (0, catchAsyncError_1.catchAsync)(async (req, res) => {
            const data = await this.transactionService.getAllTransactions();
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Transactions returned successfully', 200, data, data.length);
        });
        this.getUserTransactions = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                id = user.id;
            }
            const data = await this.transactionService.getUserTransactions(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Transactions returned successfully!', 200, data, data.length);
        });
        this.getTransaction = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            let id = Number(req.params.id);
            const data = await this.transactionService.getTransaction(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Transaction details returned successfully!', 200, data);
        });
    }
}
exports.default = TransactionController;
