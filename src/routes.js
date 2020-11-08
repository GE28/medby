import { Router } from 'express';

import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';

const publicRoutes = Router();

publicRoutes.use(UserRoutes);
publicRoutes.use('/admin/', AdminRoutes);

export default publicRoutes;
