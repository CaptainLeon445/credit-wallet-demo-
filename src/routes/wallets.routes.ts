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

const walletsRoutes = express.Router();
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

walletsRoutes.use(authMiddleware.authProtect);
walletsRoutes.use(authMiddleware.authRestrictTo(['superadmin']));

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets:
 *   get:
 *     summary: Get all the available users wallets
 *     tags: [Users wallets]
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
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}:
 *   get:
 *     summary: Get a user wallet details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
 *     responses:
 *       200:
 *         description: Wallet details returned successfully.
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
walletsRoutes.get('/:id', walletController.getWallet.bind(walletController));

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
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
walletsRoutes.patch(
  '/:id/deactivate',
  walletController.deactivateWallet.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}/activate:
 *   patch:
 *     summary: Activate a user wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
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
walletsRoutes.patch(
  '/:id/activate',
  walletController.activateWallet.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}/fund:
 *   post:
 *     summary: Fund a user wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
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
walletsRoutes.post(
  '/:id/fund',
  validateFundDeposit,
  walletController.fundWallet.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}/transfer:
 *   post:
 *     summary: Transfer from a user wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
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
walletsRoutes.post(
  '/:id/transfer',
  validateTransferFund,
  walletController.transferFunds.bind(walletController)
);

/**
 * @swagger
 * tags:
 *   name: Users wallets
 *   description: Users wallets API endpoints
 * /v1/api/wallets/{id}/withdraw:
 *   post:
 *     summary: Withdraw from a user wallet
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: Users wallets id. e.g 1,2,3,4
 *         required: true
 *     tags: [Users wallets]
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
walletsRoutes.post(
  '/:id/withdraw',
  validateFundWithdraw,
  walletController.withdrawFunds.bind(walletController)
);

export default walletsRoutes;
