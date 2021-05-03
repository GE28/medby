import { Router } from 'express';

import UserController from '../app/controllers/UserController';
import DoctorController from '../app/controllers/DoctorController';
import AvatarController from '../app/controllers/AvatarController';
import UnitController from '../app/controllers/UnitController';
import SpecialtyController from '../app/controllers/SpecialtyController';
import TimetableController from '../app/controllers/TimetableController';
import AppointmentController from '../app/controllers/AppointmentController';

import idValidator from '../middlewares/idValidator';
import tokenValidator from '../middlewares/tokenValidator';
import uploadAvatar from '../middlewares/uploadAvatar';

const adminRoutes = new Router();

const tokenMiddleware = tokenValidator('A');

const middlewares = [tokenMiddleware, idValidator];

adminRoutes.post('/upload/:id', uploadAvatar, AvatarController.store);

adminRoutes.get('/users/list', tokenMiddleware, UserController.index);
adminRoutes.get('/users/:id', middlewares, UserController.show);

adminRoutes.get('/doctors/list', tokenMiddleware, DoctorController.index);
adminRoutes.get('/doctors/:id', middlewares, DoctorController.show);
adminRoutes.post('/doctors', tokenMiddleware, DoctorController.store);
adminRoutes.delete('/doctors/:id', middlewares, DoctorController.delete);

adminRoutes.get('/units/list', tokenMiddleware, UnitController.index);
adminRoutes.get('/units/:id', middlewares, UnitController.show);
adminRoutes.put('/units/:id', middlewares, UnitController.update);
adminRoutes.post('/units', tokenMiddleware, UnitController.store);
adminRoutes.delete('/units/:id', middlewares, UnitController.delete);

adminRoutes.get(
  '/specialties/list',
  tokenMiddleware,
  SpecialtyController.index
);
adminRoutes.get('/specialties/:id', middlewares, SpecialtyController.show);
adminRoutes.put('/specialties/:id', middlewares, SpecialtyController.update);
adminRoutes.post('/specialties', tokenMiddleware, SpecialtyController.store);

adminRoutes.delete('/timetables/:id', middlewares, TimetableController.delete);
adminRoutes.get('/timetables/list', tokenMiddleware, TimetableController.index);
adminRoutes.post('/timetables', tokenMiddleware, TimetableController.store);
adminRoutes.delete('/timetables/:id', middlewares, TimetableController.delete);

adminRoutes.get(
  '/appointments/list',
  tokenMiddleware,
  AppointmentController.index
);

export default adminRoutes;
