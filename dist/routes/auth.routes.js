"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_global_1 = __importDefault(require("../containers/container.global"));
const authController = container_global_1.default.resolve("AuthController");
const authRoutes = express_1.default.Router();
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
 *     registerUser:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Your email address
 *         username:
 *           type: string
 *           description: Your username
 *         password:
 *           type: string
 *           description: Your password
 *       example:
 *         email: johndoe@gmail.com
 *         username: John
 *         password: JohnDoe1#
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth API endpoints
 * /v1/api/auth/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerUser'
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/registerUser'
 *       400:
 *         description: Bad request. The provided password does not meet the required criteria.
 *       409:
 *         description: Conflict Error. A user with the provided email already exists.
 *       500:
 *         description: Some internal server error
 *
 */
authRoutes.post("/register", authController.register.bind(authController));
exports.default = authRoutes;
