import AuthController from '../controllers/auth/auth.controller';
import UserController from '../controllers/user/user.controller';
import WalletController from '../controllers/wallet/wallet.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import AuthService from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { WalletService } from '../services/wallet/wallet.service';

class Container {
  private instances: Record<string, any> = {};

  register(key: string, instance: any): void {
    this.instances[key] = instance;
  }

  resolve<T>(key: any): T {
    return this.instances[key];
  }
}
const container = new Container();

// Register Middleware
container.register('AuthMiddleware', new AuthMiddleware());

// Register Services

container.register('UserService', new UserService());
container.register('WalletService', new WalletService());
container.register(
  'AuthService',
  new AuthService(container.resolve<WalletService>('WalletService'))
);

// Register Controllers
container.register(
  'AuthController',
  new AuthController(container.resolve<AuthService>('AuthService'))
);
container.register(
  'UserController',
  new UserController(container.resolve<UserService>('UserService'))
);
container.register(
  'WalletController',
  new WalletController(container.resolve<WalletService>('WalletService'))
);

export default container;
