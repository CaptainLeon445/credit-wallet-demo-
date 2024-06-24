import express from 'express';
import AuthController from '../controllers/auth/auth.controller';
import container from '../containers/container.global';
import {
  validateLogin,
  validateRegister,
} from '../middlewares/validators/auth.validators';

const authController = container.resolve<AuthController>('AuthController');

const authRoutes = express.Router();
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
 *         - role
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Your email address
 *         username:
 *           type: string
 *           description: Your username
 *         role:
 *           type: string
 *           description: Your role
 *         password:
 *           type: string
 *           description: Your password
 *       example:
 *         email: johndoe@gmail.com
 *         username: John
 *         role: user
 *         password: JohnDoe1#
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     loginUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Your username
 *         password:
 *           type: string
 *           description: Your password
 *       example:
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
 *         description: Password must be 8 characters long with a number,special character, lowercase and uppercase letter.
 *       409-1:
 *         description: User with the email already exists
 *       409-2:
 *         description: SUser with the username already exists
 *       500:
 *         description: Some internal server error
 *
 */
authRoutes.post(
  '/register',
  validateRegister,
  authController.register.bind(authController)
);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth API endpoints
 * /v1/api/auth/login:
 *   post:
 *     summary: Login into your new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginUser'
 *     responses:
 *       201:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/loginUser'
 *       401:
 *         description: Username or Password is incorrect.
 *       403:
 *         description: Your account is inactive. Kindly activate your account.
 *       404:
 *         description: No account associated with the username
 *       500:
 *         description: Some internal server error
 *
 */
authRoutes.post(
  '/login',
  validateLogin,
  authController.login.bind(authController)
);

export default authRoutes;
