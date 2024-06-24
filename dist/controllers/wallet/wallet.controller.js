"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_utils_1 = require("../../utils/global.utils");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const wallet_utils_1 = __importDefault(require("../../utils/wallet/wallet.utils"));
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
        this.getWallets = (0, catchAsyncError_1.catchAsync)(async (req, res) => {
            const data = await this.walletService.getWallets();
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallets returned successfully!', 200, data, data.length);
        });
        this.getWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user.active)
                return next(new AppError_1.AppError('User account inactive', 403));
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            const data = await this.walletService.getWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallet details returned successfully!', 200, data);
        });
        this.fundWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user.active)
                return next(new AppError_1.AppError('User account inactive', 403));
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            req.body.userWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.fundWallet(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallet funded successfully!', 201, data);
        });
        this.transferFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user.active)
                return next(new AppError_1.AppError('User account inactive', 403));
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            req.body.senderWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.transferFunds(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Transfer successful!', 201, data);
        });
        this.withdrawFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user.active)
                return next(new AppError_1.AppError('User account inactive', 403));
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            req.body.userWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.withdrawFunds(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Withdrawal successful!', 201, data);
        });
        this.deactivateWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            const data = await this.walletService.deactivateWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallet deactivated successfully!', 201, data);
        });
        this.activateWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            const data = await this.walletService.activateWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallet activated successfully!', 201, data);
        });
    }
}
exports.default = WalletController;
