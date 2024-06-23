"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler {
    static prodErrorHandler(err, res) {
        return res.status(err.statusCode).json({
            status: "error",
            error: err.message,
        });
    }
    static devErrorHandler(err, res) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
}
exports.ErrorHandler = ErrorHandler;
