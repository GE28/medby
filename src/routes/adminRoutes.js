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
const uploadRoutes = [tokenMiddleware, uploadAvatar];

adminRoutes.post('/a/doctors/upload/:id', uploadRoutes, AvatarController.store);

adminRoutes.get('/a/users', tokenMiddleware, UserController.index);
adminRoutes.get('/a/users/:id', middlewares, UserController.show);

adminRoutes.get('/a/doctors', tokenMiddleware, DoctorController.index);
adminRoutes.get('/a/doctors/:id', middlewares, DoctorController.show);
adminRoutes.post('/a/doctors', tokenMiddleware, DoctorController.store);
adminRoutes.delete('/a/doctors/:id', middlewares, DoctorController.delete);

adminRoutes.get('/a/units', tokenMiddleware, UnitController.index);
adminRoutes.get('/a/units/:id', middlewares, UnitController.show);
adminRoutes.put('/a/units/:id', middlewares, UnitController.update);
adminRoutes.post('/a/units', tokenMiddleware, UnitController.store);
adminRoutes.delete('/a/units/:id', middlewares, UnitController.delete);

adminRoutes.get('/a/specialties', tokenMiddleware, SpecialtyController.index);
adminRoutes.get('/a/specialties/:id', middlewares, SpecialtyController.show);
adminRoutes.put('/a/specialties/:id', middlewares, SpecialtyController.update);
adminRoutes.post('/a/specialties', tokenMiddleware, SpecialtyController.store);

adminRoutes.get('/a/timetables', tokenMiddleware, TimetableController.index);
adminRoutes.post('/a/timetables', tokenMiddleware, TimetableController.store);
adminRoutes.delete(
  '/a/timetables/:id',
  middlewares,
  TimetableController.delete
);

adminRoutes.get(
  '/a/appointments',
  tokenMiddleware,
  AppointmentController.index
);

export default adminRoutes;
