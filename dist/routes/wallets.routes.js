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
const walletsRoutes = express_1.default.Router();
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
 *       example:
 *         amount: 2000
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
 *       example:
 *         receiverWalletId: 3
 *         amount: 2000
 */
walletsRoutes.use(authMiddleware.authProtect);
walletsRoutes.use(authMiddleware.authRestrictTo(["superadmin"]));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets:
 *   get:
 *     summary: Get all the available wallets
 *     tags: [Wallet]
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
walletsRoutes.get('/', walletController.getWallets.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}:
 *   get:
 *     summary: Get a wallet details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.get('/:id', walletController.getWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/deactivate:
 *   patch:
 *     summary: Deactivate your wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.patch('/:id/deactivate', walletController.deactivateWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/activate:
 *   patch:
 *     summary: Activate your wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.patch('/:id/activate', walletController.activateWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/fund:
 *   post:
 *     summary: Fund a wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.post('/:id/fund', wallet_validators_1.validateFund, walletController.fundWallet.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/transfer:
 *   post:
 *     summary: Transfer from wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.post('/:id/transfer', wallet_validators_1.validateTransferFund, walletController.transferFunds.bind(walletController));
/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/withdraw:
 *   post:
 *     summary: Withdraw from a wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *         required: true
 *     tags: [Wallet]
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
walletsRoutes.post('/:id/withdraw', wallet_validators_1.validateFund, walletController.withdrawFunds.bind(walletController));
exports.default = walletsRoutes;
