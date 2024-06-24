import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import logger from '../../logger';
import { AppError } from '../ErrorHandlers/AppError';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
      'string.base': 'Your email must be a string',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Please enter your email address',
    }),
    username: Joi.string().required().messages({
      'string.base': 'Your username must be a string',
      'any.required': 'Please enter your username',
    }),
    role: Joi.string().valid('admin', 'user', 'superadmin').optional(),
    password: Joi.string().required().messages({
      'string.base': 'Your password must be a string',
      'any.required': 'Please enter your password',
    }),
  });
  req.body.email = req.body.email.trim().toLowerCase();

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.details[0].message);
    return next(new AppError(error.details[0].message, 400));
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema = Joi.object({
    username: Joi.string().required().messages({
      'string.base': 'Your username must be a string',
      'any.required': 'Please enter your first name',
    }),
    password: Joi.string().required().messages({
      'string.base': 'Your password must be a string',
      'any.required': 'Please enter your password',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.details[0].message);
    return next(new AppError(error.details[0].message, 400));
  }

  next();
};
