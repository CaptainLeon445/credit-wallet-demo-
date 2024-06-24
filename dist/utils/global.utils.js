"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUtilities = void 0;
class GlobalUtilities {
    static async response(res, message, statusCode, data, count) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            count,
            data,
        });
    }
}
exports.GlobalUtilities = GlobalUtilities;
