"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_global_1 = __importDefault(require("../containers/container.global"));
const transactionController = container_global_1.default.resolve('TransactionController');
const authMiddleware = container_global_1.default.resolve('AuthMiddleware');
const transactionRoute = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */
transactionRoute.use(authMiddleware.authProtect);
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions API endpoints
 * /v1/api/transactions:
 *   get:
 *     summary: Get all the user transactions
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
transactionRoute.get('/', transactionController.getUserTransactions.bind(transactionController));
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions API endpoints
 * /v1/api/transactions/{id}:
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
transactionRoute.get('/:id', transactionController.getTransaction.bind(transactionController));
exports.default = transactionRoute;
