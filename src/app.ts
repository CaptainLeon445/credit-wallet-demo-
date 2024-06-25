import dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';
import cors from 'cors';
import xss from 'xss';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import { GlobalUtilities } from './utils/global.utils';
import express, { NextFunction, Request, Response } from 'express';
import logger from './logger';
import userRoute from './routes/user.routes';
import usersRoute from './routes/users.routes';
import walletsRoutes from './routes/wallets.routes';
import transactionRoute from './routes/transactions.routes';

const app = express();
app.use(cors());
app.use(helmet());

app.use(express.json({ limit: '50kb' }));

// Enable XSS protection
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.xss = xss;
  next();
});

// Preventing Parameter Pollution
app.use(hpp());

// Compress text size
app.use(compression());

// Reduce Fingerprinting
app.disable('x-powered-by');

// Logger middleware
app.use(morgan('dev'));

// Custom middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Using credit wallet demo middlewares API. 💻');
  next();
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Credit wallet demo API Endpoints',
      version: '1.0.0',
      description:
        'This is a swagger documentation and endpoints for a credit wallet demo application.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [{ url: '' }],
  },
  apis: ['./src/routes/*.ts'],
  requestInterceptor: (req: any) => {
    req.credentials = 'include';
    return req;
  },
};
if (process.env.NODE_ENV === 'production') {
  swaggerOptions.definition.servers[0] = { url: process.env.SERVER_PROD_URL! };
} else {
  swaggerOptions.definition.servers[0] = {
    url: process.env.SERVER_LOCAL_URL?.replace('<PORT>', process.env.PORT!)!,
  };
}

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.get('/', (req: Request, res: Response) => {
  GlobalUtilities.response(
    res,
    'Your demo credit wallet API endpoints are available',
    200
  );
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: false })
);
app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/profile', userRoute);
app.use('/v1/api/users', usersRoute);
app.use('/v1/api/wallet', walletRoutes);
app.use('/v1/api/wallets', walletsRoutes);
app.use('/v1/api/transactions', transactionRoute);


// Log successful API request middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (res.statusCode < 400) {
      console.log('API request successful. 💻');
    }
  });
  next();
});

// Catch all unhandled routes
app.all('*', (req: Request, res: Response) => {
  logger.error(`Can't find ${req.originalUrl} on the server`);
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

export default app;
