import express from "express";
import container from "../containers/container.global";
import UserController from "../controllers/user/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const userController = container.resolve<UserController>("UserController");
const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

const userRoutes = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */

userRoutes.use(authMiddleware.authProtect);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/users:
 *   get:
 *     summary: Get all the available users
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
userRoutes.get("/", userController.getUsers.bind(userController));

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user API endpoints
 * /v1/api/users/{id}:
 *   post:
 *     summary: Get a user details
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
 *       500:
 *         description: Some internal server error
 *
 */
userRoutes.get("/:id", userController.getUser.bind(userController));

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
 *       500:
 *         description: Some internal server error
 *
 */
userRoutes.patch(
  "/:id/deactivate",
  userController.deactivateUser.bind(userController)
);

export default userRoutes;
