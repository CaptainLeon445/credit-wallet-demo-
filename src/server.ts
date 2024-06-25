import { NextFunction, Request, Response } from 'express';
import app from './app';
import { BASE_10 } from './constants/values.constant';
import logger from './logger';
import { GlobalErrorHandler } from './middlewares/ErrorHandlers/Handler';
import { createTables } from './utils/truncateTable';

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  GlobalErrorHandler.handleError(err, req, res, next);
});

const port: number = parseInt(process.env.PORT!, BASE_10) || 3001;

// createTables()
//   .then(() => {
//     console.log('Tables created successfully.');
//   })
//   .catch((error) => {
//     console.error('Error creating tables:', error);
//   })

const server = app.listen(port, async () => {
  try {
    console.info(`Demo credit wallet database connected successfully.`);
    console.info(`Demo credit wallet server running on port ${port}`);
  } catch (error: any) {
    console.error(error.message, error.status);
    logger.error(error.message);
  }
});

export default server;
