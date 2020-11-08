import { Router } from 'express';
import UserController from '../app/controllers/UserController';

const userRoutes = new Router();

userRoutes.post('/signup', UserController.store);

export default userRoutes;
