"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_global_1 = __importDefault(require("../containers/container.global"));
const userController = container_global_1.default.resolve("UserController");
const authMiddleware = container_global_1.default.resolve("AuthMiddleware");
const userRoute = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */
userRoute.use(authMiddleware.authProtect);
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/profile:
 *   get:
 *     summary: Get account profile details
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: User details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Some internal server error
 *
 */
userRoute.get("/", userController.getUser.bind(userController));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/profile/deactivate:
 *   patch:
 *     summary: Deactivate your account profile
 *     tags: [Profile]
 *     responses:
 *       201:
 *         description: User deactivated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Some internal server error
 *
 */
userRoute.patch("/deactivate", userController.deactivateUser.bind(userController));
exports.default = userRoute;
