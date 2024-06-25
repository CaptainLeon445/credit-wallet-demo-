import express from 'express';
import container from '../containers/container.global';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import TransactionController from '../controllers/transaction/transaction.controller';

const transactionController = container.resolve<TransactionController>('TransactionController');
const authMiddleware = container.resolve<AuthMiddleware>('AuthMiddleware');

const allTransactionsRoutes = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */

allTransactionsRoutes.use(authMiddleware.authProtect);
allTransactionsRoutes.use(authMiddleware.authRestrictTo(['superadmin']));

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions API endpoints
 * /v1/api/transactions/all:
 *   get:
 *     summary: Get all the transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
allTransactionsRoutes.get('/', transactionController.getTransactions.bind(transactionController));

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions API endpoints
 * /v1/api/transactions/all/{id}:
 *   get:
 *     summary: Get a Transactions details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The Transactions id. e.g 1,2,3,4
 *         required: true
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/details'
 *       404:
 *         description: Transactions details not found
 *       500:
 *         description: Some internal server error
 *
 */
allTransactionsRoutes.get('/:id', transactionController.getTransaction.bind(transactionController));


export default allTransactionsRoutes;
