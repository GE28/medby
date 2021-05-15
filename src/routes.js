import { Router } from 'express';

import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';

const routes = new Router();

routes.use(UserRoutes);
routes.use(AdminRoutes);

export default routes;
