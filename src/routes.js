import { Router } from 'express';

import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

const publicRoutes = Router();

publicRoutes.use('/', (req, res) => {
  return res.json({ msg: 'Hello Guest!' });
});

publicRoutes.use('/user/', UserRoutes);
publicRoutes.use('/admin/', AdminRoutes);

export default publicRoutes;
