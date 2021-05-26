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

adminRoutes.get('/users/', tokenMiddleware, UserController.index);
adminRoutes.get('/users/:id', middlewares, UserController.show);

adminRoutes.get('/doctors/', tokenMiddleware, DoctorController.index);
adminRoutes.get('/doctors/:id', middlewares, DoctorController.show);
adminRoutes.post('/doctors', tokenMiddleware, DoctorController.store);
adminRoutes.delete('/doctors/:id', middlewares, DoctorController.delete);

adminRoutes.get('/units/', tokenMiddleware, UnitController.index);
adminRoutes.get('/units/:id', middlewares, UnitController.show);
adminRoutes.put('/units/:id', middlewares, UnitController.update);
adminRoutes.post('/units', tokenMiddleware, UnitController.store);
adminRoutes.delete('/units/:id', middlewares, UnitController.delete);

adminRoutes.get('/specialties/', tokenMiddleware, SpecialtyController.index);
adminRoutes.get('/specialties/:id', middlewares, SpecialtyController.show);
adminRoutes.put('/specialties/:id', middlewares, SpecialtyController.update);
adminRoutes.post('/specialties', tokenMiddleware, SpecialtyController.store);

adminRoutes.get('/timetables/', tokenMiddleware, TimetableController.index);
adminRoutes.delete('/timetables/:id', middlewares, TimetableController.delete);
adminRoutes.post('/timetables', tokenMiddleware, TimetableController.store);
adminRoutes.delete('/timetables/:id', middlewares, TimetableController.delete);

adminRoutes.get('/appointments/', tokenMiddleware, AppointmentController.index);

export default adminRoutes;
