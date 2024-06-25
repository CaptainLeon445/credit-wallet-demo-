import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from '../ErrorHandlers/AppError';
import logger from '../../logger';

export const validateFundDeposit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    amount: Joi.number().min(0.0).precision(2).required().messages({
      'number.base': 'Amount must be a number',
      'number.precision': 'Amount must be at most 2 decimal places',
      'number.min': 'Amount must be at least 0.0',
      'any.required': 'Amount is required',
    }),
    type: Joi.string().required().messages({
      'number.base': 'Transaction must be a string',
      'any.required': 'Transaction is required',
    }),
    description: Joi.string().allow(''),
  });

  req.body.type = 'credit';
  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.message);
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

export const validateFundWithdraw = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    amount: Joi.number().min(0.0).precision(2).required().messages({
      'number.base': 'Amount must be a number',
      'number.precision': 'Amount must be at most 2 decimal places',
      'number.min': 'Amount must be at least 0.0',
      'any.required': 'Amount is required',
    }),
    type: Joi.string().required().messages({
      'number.base': 'Transaction must be a string',
      'any.required': 'Transaction is required',
    }),
    description: Joi.string().allow(''),
  });

  req.body.type = 'debit';
  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.message);
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

export const validateTransferFund = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    receiverWalletId: Joi.number().required().messages({
      'number.base': 'Receiver wallet Id must be a number',
      'any.required': 'Receiver wallet Id is required',
    }),
    amount: Joi.number().min(0.0).precision(2).required().messages({
      'number.base': 'Amount must be a number',
      'number.precision': 'Amount must be at most 2 decimal places',
      'number.min': 'Amount must be at least 0.0',
      'any.required': 'Amount is required',
    }),
    description: Joi.string().allow(''),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.message);
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};
