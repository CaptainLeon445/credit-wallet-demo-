import express from 'express';
import container from '../containers/container.global';
import WalletController from '../controllers/wallet/wallet.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import {
  validateFundDeposit,
  validateFundWithdraw,
  validateTransferFund,
} from '../middlewares/validators/wallet.validators';

const walletController =
  container.resolve<WalletController>('WalletController');
const authMiddleware = container.resolve<AuthMiddleware>('AuthMiddleware');

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
walletRoutes.patch(
  '/deactivate',
  walletController.deactivateWallet.bind(walletController)
);

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
walletRoutes.patch(
  '/activate',
  walletController.activateWallet.bind(walletController)
);

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
walletRoutes.post(
  '/fund',
  validateFundDeposit,
  walletController.fundWallet.bind(walletController)
);

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
walletRoutes.post(
  '/transfer',
  validateTransferFund,
  walletController.transferFunds.bind(walletController)
);

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
walletRoutes.post(
  '/withdraw',
  validateFundWithdraw,
  walletController.withdrawFunds.bind(walletController)
);

export default walletRoutes;
