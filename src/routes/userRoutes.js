import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import TokenController from '../app/controllers/TokenController';
import AppointmentController from '../app/controllers/AppointmentController';
import ATimeController from '../app/controllers/AvailableTimeController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';

const userRoutes = new Router();

userRoutes.post('/register', UserController.store);
userRoutes.post('/login', TokenController.store);

const tokenMiddleware = tokenValidator('U');

userRoutes.get('/profile', tokenMiddleware, UserController.show);

const middlewares = [tokenMiddleware, idValidator];

userRoutes.get('/appointments/:id', middlewares, AppointmentController.show);
userRoutes.get(
  '/appointments/available',
  tokenMiddleware,
  ATimeController.index
);
userRoutes.put('/appointments/:id', middlewares, AppointmentController.update);

export default userRoutes;
