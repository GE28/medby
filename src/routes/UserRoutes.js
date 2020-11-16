import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import TokenController from '../app/controllers/TokenController';
import AppointmentController from '../app/controllers/AppointmentController';
import ATimeController from '../app/controllers/AvailableTimeController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';

const userRoutes = new Router();

userRoutes.post('/signup', UserController.store);

userRoutes.post('/login', TokenController.store);

const tokenVal = tokenValidator('U');

userRoutes.get('/profile', tokenVal, UserController.show);

const tokenIdVal = [tokenVal, idValidator];

userRoutes.get('/appointments/:id', tokenIdVal, AppointmentController.show);

userRoutes.get('/appointments/:id', tokenIdVal, AppointmentController.update);

userRoutes.post('/appointments/available/', tokenVal, ATimeController.index);

export default userRoutes;
