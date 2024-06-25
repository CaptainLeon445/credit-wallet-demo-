"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const values_constant_1 = require("./constants/values.constant");
const logger_1 = __importDefault(require("./logger"));
const Handler_1 = require("./middlewares/ErrorHandlers/Handler");
app_1.default.use((err, req, res, next) => {
    Handler_1.GlobalErrorHandler.handleError(err, req, res, next);
});
const port = parseInt(process.env.PORT, values_constant_1.BASE_10) || 3001;
// createTables()
//   .then(() => {
//     console.log('Tables created successfully.');
//   })
//   .catch((error) => {
//     console.error('Error creating tables:', error);
//   })
const server = app_1.default.listen(port, async () => {
    try {
        console.info(`Demo credit wallet server running on port ${port}`);
    }
    catch (error) {
        console.error(error.message, error.status);
        logger_1.default.error(error.message);
    }
});
exports.default = server;
