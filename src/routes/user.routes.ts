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
 * /v1/api/profile:
 *   get:
 *     summary: Get account profile details
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: User returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/default'
 *       500:
 *         description: Some internal server error
 *
 */
userRoutes.get("/", userController.getUser.bind(userController));

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
 *       500:
 *         description: Some internal server error
 *
 */
userRoutes.patch(
  "/deactivate",
  userController.deactivateUser.bind(userController)
);

export default userRoutes;
