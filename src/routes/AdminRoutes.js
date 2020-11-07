import { Router } from 'express';

const AdminRoutes = new Router();

AdminRoutes.use('/', (req, res) => {
  return res.json({ msg: 'Hello Admin!' });
});

export default AdminRoutes;
