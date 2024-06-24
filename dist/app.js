"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const xss_1 = __importDefault(require("xss"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const global_utils_1 = require("./utils/global.utils");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./logger"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const wallets_routes_1 = __importDefault(require("./routes/wallets.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '50kb' }));
// Enable XSS protection
app.use((req, res, next) => {
    res.locals.xss = xss_1.default;
    next();
});
// Preventing Parameter Pollution
app.use((0, hpp_1.default)());
// Compress text size
app.use((0, compression_1.default)());
// Reduce Fingerprinting
app.disable('x-powered-by');
// Logger middleware
app.use((0, morgan_1.default)('dev'));
// Custom middleware
app.use((req, res, next) => {
    console.log('Using credit wallet demo middlewares API. 💻');
    next();
});
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Credit wallet demo API Endpoints',
            version: '1.0.0',
            description: 'This is a swagger documentation and endpoints for a credit wallet demo application.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [],
    },
    apis: ['./src/routes/*.ts'],
    requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
    },
};
if (process.env.NODE_ENV === 'production') {
    swaggerOptions.definition.servers[0] = { url: process.env.SERVER_PROD_URL };
}
else {
    swaggerOptions.definition.servers[0] = {
        url: process.env.SERVER_LOCAL_URL?.replace('<PORT>', process.env.PORT),
    };
}
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.get('/', (req, res) => {
    global_utils_1.GlobalUtilities.response(res, 'Your demo credit wallet API endpoints are available', 200);
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, { explorer: false }));
app.use('/v1/api/auth', auth_routes_1.default);
app.use('/v1/api/profile', user_routes_1.default);
app.use('/v1/api/users', users_routes_1.default);
app.use('/v1/api/wallet', wallet_routes_1.default);
app.use('/v1/api/wallets', wallets_routes_1.default);
// Log successful API request middleware
app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode < 400) {
            console.log('API request successful. 💻');
        }
    });
    next();
});
// Catch all unhandled routes
app.all('*', (req, res) => {
    logger_1.default.error(`Can't find ${req.originalUrl} on the server`);
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on the server`,
    });
});
exports.default = app;
