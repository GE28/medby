import { Router, RouterOptions } from 'express';
import UserController from '../app/controllers/UserController';
import DoctorController from '../app/controllers/DoctorController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';

const adminRoutes = new Router();

const tokenVal = tokenValidator('A');

const tokenIdVal = [tokenVal, idValidator];

adminRoutes.get('/users/list', tokenVal, UserController.index);

adminRoutes.get('/users/:id', tokenIdVal, UserController.show);

adminRoutes.get('/doctors/list', tokenVal, DoctorController.index);

adminRoutes.get('/doctors/:id', tokenIdVal, DoctorController.show);

adminRoutes.post('/doctors/', tokenVal, DoctorController.store);

adminRoutes.delete('/doctors/:id', tokenIdVal, DoctorController.delete);

export default adminRoutes;
