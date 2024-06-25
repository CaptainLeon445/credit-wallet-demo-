"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_global_1 = __importDefault(require("../containers/container.global"));
const wallet_validators_1 = require("../middlewares/validators/wallet.validators");
const walletController = container_global_1.default.resolve('WalletController');
const authMiddleware = container_global_1.default.resolve('AuthMiddleware');
const walletRoutes = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     fund:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           description: The fund amount
 *         description:
 *           type: string
 *           description: The fund description
 *       example:
 *         amount: 2000
 *         description: The fund description
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     transferFund:
 *       type: object
 *       required:
 *         - receiverWalletId
 *         - amount
 *       properties:
 *         receiverWalletId:
 *           type: number
 *           description: The user wallet id to transfer to
 *         amount:
 *           type: number
 *           description: The fund amount
 *         description:
 *           type: string
 *           description: The fund description
 *       example:
 *         receiverWalletId: 3
 *         amount: 2000
 *         description: The fund description
 */
walletRoutes.use(authMiddleware.authProtect);
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallets:
 *   get:
 *     summary: Get all the available wallets
 *     tags: [User Wallet]
 *     responses:
 *       200:
 *         description: Wallets returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.get('/', walletController.getWallets.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet:
 *   get:
 *     summary: Get your wallet details
 *     tags: [User Wallet]
 *     responses:
 *       200:
 *         description: Wallet details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/details'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.get('/', walletController.getWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet/deactivate:
 *   patch:
 *     summary: Deactivate your wallet
 *     tags: [User Wallet]
 *     responses:
 *       201:
 *         description: Wallet deactivated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.patch('/deactivate', walletController.deactivateWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet/activate:
 *   patch:
 *     summary: Activate your wallet
 *     tags: [User Wallet]
 *     responses:
 *       201:
 *         description: Wallet activated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.patch('/activate', walletController.activateWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet/fund:
 *   post:
 *     summary: Fund your wallet
 *     tags: [User Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fund'
 *     responses:
 *       201:
 *         description: Wallet funded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/fund'
 *       403-1:
 *         description: User is inactive
 *       403-2:
 *         description: Wallet is inactive
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post('/fund', wallet_validators_1.validateFundDeposit, walletController.fundWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet/transfer:
 *   post:
 *     summary: Transfer from your wallet
 *     tags: [User Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/transferFund'
 *     responses:
 *       201:
 *         description: Transfer successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/transferFund'
 *       403-1:
 *         description: User is inactive
 *       403-2:
 *         description: Sender's wallet is inactive
 *       403-3:
 *         description: Receiver's wallet is inactive
 *       404-4:
 *         description: Sender's wallet not found
 *       404-2:
 *         description: Receiver's wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post('/transfer', wallet_validators_1.validateTransferFund, walletController.transferFunds.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: User Wallet
 *   description: The user wallet API endpoints
 * /v1/api/wallet/withdraw:
 *   post:
 *     summary: Withdraw from your wallet
 *     tags: [User Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fund'
 *     responses:
 *       201:
 *         description: Withdrawal successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/fund'
 *       403-1:
 *         description: User is inactive
 *       403-2:
 *         description: Wallet is inactive
 *       404:
 *         description: Wallet not found
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post('/withdraw', wallet_validators_1.validateFundWithdraw, walletController.withdrawFunds.bind(walletController));
exports.default = walletRoutes;
