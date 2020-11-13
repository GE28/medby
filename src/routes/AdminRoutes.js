import { Router, RouterOptions } from 'express';
import UserController from '../app/controllers/UserController';
import DoctorController from '../app/controllers/DoctorController';
import UnitController from '../app/controllers/UnitController';
import SpecialtyController from '../app/controllers/SpecialtyController';

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

adminRoutes.get('/units/list', tokenVal, UnitController.index);

adminRoutes.get('/units/:id', tokenIdVal, UnitController.show);

adminRoutes.get('/units/:id', tokenIdVal, UnitController.update);

adminRoutes.post('/units/', tokenVal, UnitController.store);

adminRoutes.delete('/units/:id', tokenIdVal, UnitController.delete);

adminRoutes.get('/specialty/list', tokenVal, SpecialtyController.index);

adminRoutes.get('/specialty/:id', tokenIdVal, SpecialtyController.show);

adminRoutes.get('/specialty/:id', tokenIdVal, SpecialtyController.update);

adminRoutes.post('/specialty/', tokenVal, SpecialtyController.store);

adminRoutes.delete('/specialty/:id', tokenIdVal, SpecialtyController.delete);

export default adminRoutes;
