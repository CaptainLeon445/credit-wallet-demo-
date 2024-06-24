import express from 'express';
import container from '../containers/container.global';
import UserController from '../controllers/user/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const userController = container.resolve<UserController>('UserController');
const authMiddleware = container.resolve<AuthMiddleware>('AuthMiddleware');

const usersRoute = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     default:
 */

usersRoute.use(authMiddleware.authProtect);
usersRoute.use(authMiddleware.authRestrictTo(['superadmin']));

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
usersRoute.get('/', userController.getUsers.bind(userController));

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
usersRoute.get('/:id', userController.getUser.bind(userController));

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
usersRoute.patch(
  '/:id/deactivate',
  userController.deactivateUser.bind(userController)
);

export default usersRoute;
