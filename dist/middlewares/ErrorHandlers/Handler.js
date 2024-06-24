"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const errorHandler_utilities_1 = require("../../utils/errorHandler.utilities");
class GlobalErrorHandler {
    static handleError(err, req, res, next // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        const error = err;
        error.statusCode = error.statusCode || 500;
        error.message =
            error.message || 'Internal server error! Please try again later';
        errorHandler_utilities_1.ErrorHandler.devErrorHandler(error, res);
    }
}
exports.GlobalErrorHandler = GlobalErrorHandler;
