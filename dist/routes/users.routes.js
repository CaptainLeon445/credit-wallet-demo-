"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_global_1 = __importDefault(require("../containers/container.global"));
const userController = container_global_1.default.resolve("UserController");
const authMiddleware = container_global_1.default.resolve("AuthMiddleware");
const usersRoute = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */
usersRoute.use(authMiddleware.authProtect);
usersRoute.use(authMiddleware.authRestrictTo(["superadmin"]));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/users:
 *   get:
 *     summary: Get all the users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
usersRoute.get("/", userController.getUsers.bind(userController));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/users/{id}:
 *   post:
 *     summary: Get a user profile
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The user id. e.g 1,2,3,4
 *         required: true
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/details'
 *       403:
 *         description: User is inactive
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Some internal server error
 *
 */
usersRoute.get("/:id", userController.getUser.bind(userController));
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/users/{id}/deactivate:
 *   patch:
 *     summary: Fund a User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: The user id. e.g 1,2,3,4
 *         required: true
 *     tags: [User]
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
usersRoute.patch("/:id/deactivate", userController.deactivateUser.bind(userController));
exports.default = usersRoute;
