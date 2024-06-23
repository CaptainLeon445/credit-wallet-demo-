import { Request, Response, NextFunction } from "express";
import { GlobalUtilities } from "../../utils/global.utils";
import { WalletService } from "../../services/wallet/wallet.service";
import { FundDTO, TransferFundDTO } from "../../utils/dto/wallet.dto";
import { catchAsync } from "../../utils/catchAsyncError";
import WalletUtils from "../../utils/wallet/wallet.utils";

export default class WalletController {
  constructor(private readonly walletService: WalletService) {}
  public getWallets = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.walletService.getWallets();
      if (data)
        await GlobalUtilities.response(
          res,
          "Wallets returned successfully!",
          201,
          data,
          data.length
        );
    }
  );
  public getWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      console.log(id);
      const data = await this.walletService.getWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "Wallet details returned successfully!",
          200,
          data
        );
    }
  );
  public fundWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      req.body.userWalletId = id;
      const requestData: FundDTO = req.body;
      const data = await this.walletService.fundWallet(requestData, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "Wallet funded successfully!",
          201,
          data
        );
    }
  );

  public transferFunds = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }

      req.body.senderWalletId = id;
      const requestData: TransferFundDTO = req.body;
      const data = await this.walletService.transferFunds(requestData, next);
      if (data)
        await GlobalUtilities.response(res, "Transfer successful!", 201, data);
    }
  );

  public withdrawFunds = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      req.body.userWalletId = id;
      const requestData: FundDTO = req.body;
      const data = await this.walletService.withdrawFunds(requestData, next);
      if (data)
        await GlobalUtilities.response(res, "Withdraw successful!", 201, data);
    }
  );

  public deactivateWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      const data = await this.walletService.deactivateWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "Wallet deactivated successfully!",
          201,
          data
        );
    }
  );

  public activateWallet = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === "superadmin") id = Number(req.params.id);
      else {
        const wallet = await WalletUtils.getWalletByUId(user.id);
        id = wallet.id;
      }
      const data = await this.walletService.activateWallet(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          "Wallet activated successfully!",
          201,
          data
        );
    }
  );
}
