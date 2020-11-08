import { Router } from 'express';
import UserController from '../app/controllers/UserController';

import idValidator from '../middlewares/idValidator';

const adminRoutes = new Router();

adminRoutes.get('/users/list', UserController.index);

adminRoutes.get('/users/:id', idValidator, UserController.show);

export default adminRoutes;
