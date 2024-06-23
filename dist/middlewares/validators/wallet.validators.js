"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransferFund = exports.validateFund = void 0;
const joi_1 = __importDefault(require("joi"));
const AppError_1 = require("../ErrorHandlers/AppError");
const logger_1 = __importDefault(require("../../logger"));
const validateFund = (req, res, next) => {
    const schema = joi_1.default.object({
        amount: joi_1.default.number().min(0.0).precision(2).required().messages({
            "number.base": "Amount must be a number",
            "number.precision": "Amount must be at most 2 decimal places",
            "number.min": "Amount must be at least 0.0",
            "any.required": "Amount is required",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        logger_1.default.error(error.message);
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    next();
};
exports.validateFund = validateFund;
const validateTransferFund = (req, res, next) => {
    const schema = joi_1.default.object({
        receiverWalletId: joi_1.default.number().required().messages({
            "number.base": "Receiver wallet Id must be a number",
            "any.required": "Receiver wallet Id is required",
        }),
        amount: joi_1.default.number().min(0.0).precision(2).required().messages({
            "number.base": "Amount must be a number",
            "number.precision": "Amount must be at most 2 decimal places",
            "number.min": "Amount must be at least 0.0",
            "any.required": "Amount is required",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        logger_1.default.error(error.message);
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    next();
};
exports.validateTransferFund = validateTransferFund;
