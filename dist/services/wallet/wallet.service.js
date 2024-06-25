"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const db_connection_1 = __importDefault(require("../../config/db.connection"));
const AppError_1 = require("../../middlewares/ErrorHandlers/AppError");
const wallet_utils_1 = __importDefault(require("../../utils/wallet/wallet.utils"));
class WalletService {
    async createWallet(walletDTO, next) {
        try {
            const [data] = await (0, db_connection_1.default)('wallets').insert(walletDTO).returning('*');
            return data;
        }
        catch (error) {
            return next(new AppError_1.AppError(error.message, error.status));
        }
    }
    async getWallets() {
        const wallets = await (0, db_connection_1.default)('wallets').returning('*');
        return wallets;
    }
    async getWallet(id, next) {
        const wallet = await wallet_utils_1.default.getWalletById(id);
        if (!wallet)
            return next(new AppError_1.AppError('Wallet not found', 404));
        return wallet;
    }
    async deactivateWallet(id, next) {
        const wallet = await wallet_utils_1.default.getWalletById(id);
        if (!wallet)
            return next(new AppError_1.AppError('Wallet not found', 404));
        const data = await wallet_utils_1.default.deactivateWallet(id);
        return data;
    }
    async activateWallet(id, next) {
        const wallet = await wallet_utils_1.default.getWalletById(id);
        if (!wallet)
            return next(new AppError_1.AppError('Wallet not found', 404));
        const data = await wallet_utils_1.default.activateWallet(id);
        return data;
    }
    async fundWallet(walletDTO, next) {
        const { userWalletId, amount } = walletDTO;
        const wallet = await wallet_utils_1.default.getWalletById(userWalletId);
        if (!wallet)
            return next(new AppError_1.AppError('Wallet not found', 404));
        if (!wallet.active)
            return next(new AppError_1.AppError('Wallet is inactive', 403));
        const [data] = await (0, db_connection_1.default)('wallets')
            .where({ id: userWalletId })
            .increment('balance', amount)
            .returning('*');
        return data;
    }
    async transferFunds(walletDTO, next) {
        const { senderWalletId, receiverWalletId, amount } = walletDTO;
        try {
            const trx = await db_connection_1.default.transaction();
            const receiver = await wallet_utils_1.default.getWalletById(receiverWalletId);
            const sender = await wallet_utils_1.default.getWalletById(senderWalletId);
            if (!receiver)
                return next(new AppError_1.AppError("Receiver's wallet not found", 404));
            if (!receiver.active)
                return next(new AppError_1.AppError("Receiver's wallet is inactive", 403));
            if (!sender)
                return next(new AppError_1.AppError("Sender's wallet is not found", 404));
            if (!sender.active)
                return next(new AppError_1.AppError("Sender's wallet is inactive", 403));
            if (sender.balance < amount)
                return next(new AppError_1.AppError('Insufficient balance', 400));
            const [result] = await trx('wallets')
                .where({ id: senderWalletId })
                .decrement('balance', amount)
                .returning('*');
            await trx('wallets')
                .where({ id: receiverWalletId })
                .increment('balance', amount)
                .returning('*');
            await trx.commit();
            delete walletDTO.senderWalletId;
            delete walletDTO.receiverWalletId;
            const receiverTrxDTA = {
                ...walletDTO,
                type: 'credit',
                uid: receiver.uid,
                receiverId: receiver.uid,
                senderId: sender.uid,
                walletId: receiverWalletId,
            };
            const senderTrxDTA = {
                ...walletDTO,
                type: 'debit',
                uid: sender.uid,
                receiverId: receiver.uid,
                senderId: sender.uid,
                walletId: senderWalletId,
            };
            return { result, receiverTrxDTA, senderTrxDTA };
        }
        catch (error) {
            return next(new AppError_1.AppError(error.message, error.status));
        }
    }
    async withdrawFunds(walletDTO, next) {
        const { userWalletId, amount } = walletDTO;
        const wallet = await wallet_utils_1.default.getWalletById(userWalletId);
        if (wallet.balance < amount)
            return next(new AppError_1.AppError('Insufficient balance', 400));
        if (!wallet)
            return next(new AppError_1.AppError('Wallet not found', 404));
        if (!wallet.active)
            return next(new AppError_1.AppError('Wallet is inactive', 403));
        const [data] = await (0, db_connection_1.default)('wallets')
            .where({ id: userWalletId })
            .decrement('balance', amount)
            .returning('*');
        return data;
    }
}
exports.WalletService = WalletService;
