import { NextFunction } from 'express';
import db from '../../config/db.connection';
import { AppError } from '../../middlewares/ErrorHandlers/AppError';
import { FundDTO, TransferFundDTO } from '../../utils/dto/wallet.dto';
import WalletUtils from '../../utils/wallet/wallet.utils';

export class WalletService {
  public async createWallet(
    walletDTO: Record<string, any>,
    next: NextFunction
  ) {
    try {
      const [data] = await db('wallets').insert(walletDTO).returning('*');
      return data;
    } catch (error: any) {
      return next(new AppError(error.message, error.status));
    }
  }

  public async getWallets() {
    const wallets = await db('wallets').returning('*');
    return wallets;
  }

  public async getWallet(id: number, next: NextFunction) {
    const wallet = await WalletUtils.getWalletById(id);
    if (!wallet) return next(new AppError('Wallet not found', 404));
    return wallet;
  }

  public async deactivateWallet(id: number, next: NextFunction) {
    const wallet = await WalletUtils.getWalletById(id);
    if (!wallet) return next(new AppError('Wallet not found', 404));
    const data = await WalletUtils.deactivateWallet(id);
    return data;
  }

  public async activateWallet(id: number, next: NextFunction) {
    const wallet = await WalletUtils.getWalletById(id);
    if (!wallet) return next(new AppError('Wallet not found', 404));
    const data = await WalletUtils.activateWallet(id);
    return data;
  }

  public async fundWallet(walletDTO: FundDTO, next: NextFunction) {
    const { userWalletId, amount } = walletDTO;
    const wallet = await WalletUtils.getWalletById(userWalletId);
    if (!wallet) return next(new AppError('Wallet not found', 404));
    if (!wallet.active) return next(new AppError('Wallet is inactive', 403));
    const [data] = await db('wallets')
      .where({ id: userWalletId })
      .increment('balance', amount)
      .returning('*');
    return data;
  }

  public async transferFunds(walletDTO: TransferFundDTO, next: NextFunction) {
    const { senderWalletId, receiverWalletId, amount } = walletDTO;
    try {
      const trx = await db.transaction();
      const receiver = await WalletUtils.getWalletById(receiverWalletId!);
      const sender = await WalletUtils.getWalletById(senderWalletId!);
      if (!receiver)
        return next(new AppError("Receiver's wallet not found", 404));
      if (!receiver.active)
        return next(new AppError("Receiver's wallet is inactive", 403));
      if (!sender)
        return next(new AppError("Sender's wallet is not found", 404));
      if (!sender.active)
        return next(new AppError("Sender's wallet is inactive", 403));
      if (sender.balance < amount)
        return next(new AppError('Insufficient balance', 400));
      const [result] = await trx('wallets')
        .where({ id: senderWalletId! })
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
    } catch (error: any) {
      return next(new AppError(error.message, error.status));
    }
  }
  
  public async withdrawFunds(walletDTO: FundDTO, next: NextFunction) {
    const { userWalletId, amount } = walletDTO;
    const wallet = await WalletUtils.getWalletById(userWalletId);
    if (!wallet) return next(new AppError('Wallet not found', 404));
    if (!wallet.active) return next(new AppError('Wallet is inactive', 403));
    if (wallet.balance < amount)
      return next(new AppError('Insufficient balance', 400));
    const [data] = await db('wallets')
      .where({ id: userWalletId })
      .decrement('balance', amount)
      .returning('*');
    return data;
  }
}
