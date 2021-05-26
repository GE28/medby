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
userRoutes.get('/verify', tokenValidator(null), (req, res) =>
  res.status(200).json({ message: 'ok' })
);

const tokenMiddleware = tokenValidator('U');

userRoutes.get('/profile', tokenMiddleware, UserController.show);

const middlewares = [tokenMiddleware, idValidator];

userRoutes.get(
  '/appointments/available',
  tokenMiddleware,
  ATimeController.index
);
userRoutes.get('/appointments/', middlewares, AppointmentController.index);
userRoutes.get('/appointments/:id', middlewares, AppointmentController.show);
userRoutes.post('/appointments/', middlewares, AppointmentController.store);
userRoutes.put('/appointments/:id', middlewares, AppointmentController.update);

export default userRoutes;
