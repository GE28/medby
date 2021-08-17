import { Router } from 'express';

import UserController from '../app/controllers/UserController';
import TokenController from '../app/controllers/TokenController';
import AvatarController from '../app/controllers/AvatarController';
import AppointmentController from '../app/controllers/AppointmentController';
import ATimeController from '../app/controllers/AvailableTimeController';

import UnitController from '../app/controllers/UnitController';
import SpecialtyController from '../app/controllers/SpecialtyController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';
import uploadAvatar from '../middlewares/uploadAvatar';

const userRoutes = new Router();

userRoutes.post('/register', UserController.store);
userRoutes.post('/login', TokenController.store);

const tokenMiddleware = tokenValidator('U');

userRoutes.get('/profile', tokenMiddleware, UserController.show);
userRoutes.put('/profile', tokenMiddleware, UserController.update);

userRoutes.get('/units', tokenMiddleware, UnitController.index);
userRoutes.get('/specialties', tokenMiddleware, SpecialtyController.index);

const middlewares = [tokenMiddleware, idValidator];
const uploadRoutes = [tokenMiddleware, uploadAvatar];

userRoutes.get(
  '/appointments/available/:id/',
  tokenMiddleware,
  ATimeController.show
);

userRoutes.get(
  '/appointments/available',
  tokenMiddleware,
  ATimeController.index
);

userRoutes.get('/appointments', tokenMiddleware, AppointmentController.index);
userRoutes.get(
  '/appointments/:id',
  tokenMiddleware,
  AppointmentController.show
);
userRoutes.post('/appointments', tokenMiddleware, AppointmentController.store);
userRoutes.put('/appointments/:id', middlewares, AppointmentController.update);

userRoutes.post('/upload', uploadRoutes, AvatarController.store);

export default userRoutes;
