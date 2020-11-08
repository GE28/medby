import { Router } from 'express';
import UserController from '../app/controllers/UserController';

const adminRoutes = new Router();

adminRoutes.get('/users/list', UserController.index);

export default adminRoutes;
