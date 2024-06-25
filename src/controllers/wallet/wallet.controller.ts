import { Request, Response, NextFunction } from 'express';
import { GlobalUtilities } from '../../utils/global.utils';
import { WalletService } from '../../services/wallet/wallet.service';
import {
  FundDTO,
  FundWalletDTO,
  TransferFundDTO,
} from '../../utils/dto/wallet.dto';
import { catchAsync } from '../../utils/catchAsyncError';
import WalletUtils from '../../utils/wallet/wallet.utils';
import { AppError } from '../../middlewares/ErrorHandlers/AppError';
import { TransactionService } from '../../services/transaction/transaction.services';

export default class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService
  ) {}

  public getWallets = catchAsync(async (req: Request, res: Response) => {
    const data = await this.walletService.getWallets();
    if (data)
      await GlobalUtilities.response(
        res,
        'Wallets returned successfully!',
        200,
        data,
        data.length
      );
  });

  public getWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      const data = await this.walletService.getWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'Wallet details returned successfully!',
          200,
          data
        );
    }
  );

  public fundWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let uid: number;
      let walletId: number;

      if (user.role === 'superadmin') {
        walletId = Number(req.params.id);
        const wallet = await WalletUtils.getWalletById(walletId);
        uid = wallet.uid;
      } else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        const wallet = await WalletUtils.getWalletByUId(user.id);
        uid = user.id;
        walletId = wallet.id;
      }
      const trxDTA: FundWalletDTO = { ...req.body, uid, walletId };
      const requestData: FundDTO = {
        amount: req.body.amount,
        userWalletId: walletId,
      };
      const data = await this.walletService.fundWallet(requestData, next);
      const dataTrx = await this.transactionService.createTransaction(
        trxDTA,
        next
      );
      if (data && dataTrx) {
        await GlobalUtilities.response(
          res,
          'Wallet funded successfully!',
          201,
          data
        );
      }
    }
  );

  public transferFunds = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let uid: number;
      let walletId: number;

      if (user.role === 'superadmin') {
        walletId = Number(req.params.id);
        const wallet = await WalletUtils.getWalletById(walletId);
        uid = wallet.uid;
      } else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        const wallet = await WalletUtils.getWalletByUId(user.id);
        uid = user.id;
        walletId = wallet.id;
      }

      req.body.senderWalletId = walletId;
      const requestData: TransferFundDTO = req.body;
      const data = await this.walletService.transferFunds(requestData, next);
      if (data) {
        await this.transactionService.createTransaction(
          data.senderTrxDTA,
          next
        );
        await this.transactionService.createTransaction(
          data.receiverTrxDTA,
          next
        );
        await GlobalUtilities.response(
          res,
          'Transfer successful!',
          201,
          data.result
        );
      }
    }
  );

  public withdrawFunds = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let uid: number;
      let walletId: number;

      if (user.role === 'superadmin') {
        walletId = Number(req.params.id);
        const wallet = await WalletUtils.getWalletById(walletId);
        uid = wallet.uid;
      } else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        const wallet = await WalletUtils.getWalletByUId(user.id);
        uid = user.id;
        walletId = wallet.id;
      }
      const trxDTA = { ...req.body, uid, walletId };
      req.body.userWalletId = walletId;
      const requestData: FundDTO = req.body;
      const data = await this.walletService.withdrawFunds(requestData, next);
      if (data) {
        await this.transactionService.createTransaction(trxDTA, next);
        await GlobalUtilities.response(
          res,
          'Withdrawal successful!',
          201,
          data
        );
      }
    }
  );

  public deactivateWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      const data = await this.walletService.deactivateWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'Wallet deactivated successfully!',
          201,
          data
        );
    }
  );

  public activateWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      const data = await this.walletService.activateWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'Wallet activated successfully!',
          201,
          data
        );
    }
  );
}
