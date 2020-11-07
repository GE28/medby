import { Router } from 'express';

const UserRoutes = new Router();

UserRoutes.use('/', (req, res) => {
  return res.json({ msg: 'Hello User!' });
});

export default UserRoutes;
