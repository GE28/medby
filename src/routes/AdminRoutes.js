import { Router } from 'express';
import UserController from '../app/controllers/UserController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';

const adminRoutes = new Router();

const tokenVal = tokenValidator('A');

const tokenIdVal = [tokenVal, idValidator];

adminRoutes.get('/users/list', tokenVal, UserController.index);

adminRoutes.get('/users/:id', tokenIdVal, UserController.show);

export default adminRoutes;
