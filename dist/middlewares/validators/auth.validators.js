"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
const AppError_1 = require("../ErrorHandlers/AppError");
const validateRegister = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email({ minDomainSegments: 2 }).required().messages({
            "string.base": "Your email must be a string",
            "string.email": "Please enter a valid email address",
            "any.required": "Please enter your email address",
        }),
        username: joi_1.default.string().required().messages({
            "string.base": "Your username must be a string",
            "any.required": "Please enter your first name",
        }),
        role: joi_1.default.string().valid('admin', 'user', 'superadmin').required(),
        password: joi_1.default.string().required().messages({
            "string.base": "Your password must be a string",
            "any.required": "Please enter your password",
        }),
    });
    req.body.email = req.body.email.trim().toLowerCase();
    const { error } = schema.validate(req.body);
    if (error) {
        logger_1.default.error(error.details[0].message);
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required().messages({
            "string.base": "Your username must be a string",
            "any.required": "Please enter your first name",
        }),
        password: joi_1.default.string().required().messages({
            "string.base": "Your password must be a string",
            "any.required": "Please enter your password",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        logger_1.default.error(error.details[0].message);
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    next();
};
exports.validateLogin = validateLogin;
