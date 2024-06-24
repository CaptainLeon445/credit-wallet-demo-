"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../controllers/auth/auth.controller"));
const user_controller_1 = __importDefault(require("../controllers/user/user.controller"));
const wallet_controller_1 = __importDefault(require("../controllers/wallet/wallet.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_service_1 = __importDefault(require("../services/auth/auth.service"));
const user_service_1 = require("../services/user/user.service");
const wallet_service_1 = require("../services/wallet/wallet.service");
class Container {
    constructor() {
        this.instances = {};
    }
    register(key, instance) {
        this.instances[key] = instance;
    }
    resolve(key) {
        return this.instances[key];
    }
}
const container = new Container();
// Register Middleware
container.register('AuthMiddleware', new auth_middleware_1.AuthMiddleware());
// Register Services
container.register('UserService', new user_service_1.UserService());
container.register('WalletService', new wallet_service_1.WalletService());
container.register('AuthService', new auth_service_1.default(container.resolve('WalletService')));
// Register Controllers
container.register('AuthController', new auth_controller_1.default(container.resolve('AuthService')));
container.register('UserController', new user_controller_1.default(container.resolve('UserService')));
container.register('WalletController', new wallet_controller_1.default(container.resolve('WalletService')));
exports.default = container;
