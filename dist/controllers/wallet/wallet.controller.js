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
    constructor(walletService, transactionService) {
        this.walletService = walletService;
        this.transactionService = transactionService;
        this.getWallets = (0, catchAsyncError_1.catchAsync)(async (req, res) => {
            const data = await this.walletService.getWallets();
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallets returned successfully!', 200, data, data.length);
        });
        this.getWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                id = wallet.id;
            }
            const data = await this.walletService.getWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, 'Wallet details returned successfully!', 200, data);
        });
        this.fundWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let uid;
            let walletId;
            if (user.role === 'superadmin') {
                walletId = Number(req.params.id);
                const wallet = await wallet_utils_1.default.getWalletById(walletId);
                uid = wallet.uid;
            }
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                uid = user.id;
                walletId = wallet.id;
            }
            const trxDTA = { ...req.body, uid, walletId };
            const requestData = {
                amount: req.body.amount,
                userWalletId: walletId,
            };
            const data = await this.walletService.fundWallet(requestData, next);
            const dataTrx = await this.transactionService.createTransaction(trxDTA, next);
            if (data && dataTrx) {
                await global_utils_1.GlobalUtilities.response(res, 'Wallet funded successfully!', 201, data);
            }
        });
        this.transferFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let uid;
            let walletId;
            if (user.role === 'superadmin') {
                walletId = Number(req.params.id);
                const wallet = await wallet_utils_1.default.getWalletById(walletId);
                uid = wallet.uid;
            }
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                uid = user.id;
                walletId = wallet.id;
            }
            req.body.senderWalletId = walletId;
            const requestData = req.body;
            const data = await this.walletService.transferFunds(requestData, next);
            if (data) {
                await this.transactionService.createTransaction(data.senderTrxDTA, next);
                await this.transactionService.createTransaction(data.receiverTrxDTA, next);
                await global_utils_1.GlobalUtilities.response(res, 'Transfer successful!', 201, data.result);
            }
        });
        this.withdrawFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let uid;
            let walletId;
            if (user.role === 'superadmin') {
                walletId = Number(req.params.id);
                const wallet = await wallet_utils_1.default.getWalletById(walletId);
                uid = wallet.uid;
            }
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
                const wallet = await wallet_utils_1.default.getWalletByUId(user.id);
                uid = user.id;
                walletId = wallet.id;
            }
            const trxDTA = { ...req.body, uid, walletId };
            req.body.userWalletId = walletId;
            const requestData = req.body;
            const data = await this.walletService.withdrawFunds(requestData, next);
            if (data) {
                await this.transactionService.createTransaction(trxDTA, next);
                await global_utils_1.GlobalUtilities.response(res, 'Withdrawal successful!', 201, data);
            }
        });
        this.deactivateWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === 'superadmin')
                id = Number(req.params.id);
            else {
                if (!user.active)
                    return next(new AppError_1.AppError('User account inactive', 403));
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
