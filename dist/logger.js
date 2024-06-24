"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { timestamp, json, combine } = winston_1.default.format;
const logger = winston_1.default.createLogger({
    format: combine(timestamp(), json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: 'logs/errors/error.log',
            level: 'error',
        }),
    ],
});
exports.default = logger;
