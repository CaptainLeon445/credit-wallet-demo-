import { NextFunction, Request, Response } from 'express';
import { GlobalUtilities } from '../../utils/global.utils';
import { catchAsync } from '../../utils/catchAsyncError';
import { AppError } from '../../middlewares/ErrorHandlers/AppError';
import { TransactionService } from '../../services/transaction/transaction.services';

export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  public getTransactions = catchAsync(async (req: Request, res: Response) => {
    const data = await this.transactionService.getAllTransactions();
    if (data)
      await GlobalUtilities.response(
        res,
        'Transactions returned successfully',
        200,
        data,
        data.length
      );
  });

  public getUserTransactions = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      let id: number;
      if (user.role === 'superadmin') id = Number(req.params.id);
      else {
        if (!user.active)
          return next(new AppError('User account inactive', 403));
        id = user.id;
      }
      const data = await this.transactionService.getUserTransactions(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'Transactions returned successfully!',
          200,
          data,
          data.length
        );
    }
  );

  public getTransaction = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let id: number = Number(req.params.id);
      const data = await this.transactionService.getTransaction(id, next);
      if (data)
        await GlobalUtilities.response(
          res,
          'Transaction details returned successfully!',
          200,
          data
        );
    }
  );
}
