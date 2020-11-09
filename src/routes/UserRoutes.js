import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import TokenController from '../app/controllers/TokenController';

import tokenValidator from '../middlewares/tokenValidator';

const userRoutes = new Router();

userRoutes.post('/signup', UserController.store);

userRoutes.post('/login', TokenController.store);

const tokenVal = tokenValidator('U');

userRoutes.get('/profile', tokenVal, UserController.show);

export default userRoutes;
