import express from "express";
import container from "../containers/container.global";
import WalletController from "../controllers/wallet/wallet.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const walletController =
  container.resolve<WalletController>("WalletController");
const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

const walletRoutes = express.Router();
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

walletRoutes.use(authMiddleware.authProtect);

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
 *         description: Account funded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.get(
  "/",
  authMiddleware.authRestrictTo(["superadmin"]),
  walletController.getWallets.bind(walletController)
);

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
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Wallet details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/details'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.get("/:id", walletController.getWallet.bind(walletController));

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/deactivate:
 *   patch:
 *     summary: Fund a wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *     tags: [Wallet]
 *     responses:
 *       201:
 *         description: Wallet deactivated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.patch(
  "/:id/deactivate",
  walletController.deactivateWallet.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/activate:
 *   patch:
 *     summary: Fund a wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *     tags: [Wallet]
 *     responses:
 *       201:
 *         description: Wallet activated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.patch(
  "/:id/activate",
  walletController.activateWallet.bind(walletController)
);

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
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fund'
 *     responses:
 *       201:
 *         description: Account funded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/fund'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post(
  "/:id/fund",
  walletController.fundWallet.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: The wallet API endpoints
 * /v1/api/wallets/{id}/transfer:
 *   post:
 *     summary: Transfer from a wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The wallet id. e.g 1,2,3,4
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/transferFund'
 *     responses:
 *       201:
 *         description: Account funded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/transferFund'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post(
  "/:id/transfer",
  walletController.transferFunds.bind(walletController)
);

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
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fund'
 *     responses:
 *       201:
 *         description: Account funded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/fund'
 *       500:
 *         description: Some internal server error
 *
 */
walletRoutes.post(
  "/:id/withdraw",
  walletController.withdrawFunds.bind(walletController)
);

export default walletRoutes;
