"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_utils_1 = require("../../utils/global.utils");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
        this.getWallets = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const data = await this.walletService.getWallets();
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Wallets returned successfully!", 201, data, data.length);
        });
        this.getWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const id = Number(req.params.id);
            const data = await this.walletService.getWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Wallet details returned successfully!", 200, data);
        });
        this.fundWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === "superadmin")
                id = Number(req.params.id);
            else
                id = user.id;
            req.body.userWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.fundWallet(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Wallet funded successfully!", 201, data);
        });
        this.transferFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === "superadmin")
                id = Number(req.params.id);
            else
                id = user.id;
            req.body.senderWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.transferFunds(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Transfer successful!", 201, data);
        });
        this.withdrawFunds = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === "superadmin")
                id = Number(req.params.id);
            else
                id = user.id;
            req.body.userWalletId = id;
            const requestData = req.body;
            const data = await this.walletService.withdrawFunds(requestData, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Withdraw successful!", 201, data);
        });
        this.deactivateWallet = (0, catchAsyncError_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            let id;
            if (user.role === "superadmin")
                id = Number(req.params.id);
            else
                id = user.id;
            const data = await this.walletService.deactivateWallet(id, next);
            if (data)
                await global_utils_1.GlobalUtilities.response(res, "Wallet deactivated successfully!", 201, data);
        });
    }
}
exports.default = WalletController;
