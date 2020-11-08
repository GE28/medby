import { Router } from 'express';

import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';

const publicRoutes = new Router();

publicRoutes.use(UserRoutes);
publicRoutes.use(AdminRoutes);

export default publicRoutes;
