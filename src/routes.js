import { Router } from 'express';

const routes = Router();

routes.use('/', (req, res) => {
  return res.json({ msg: 'Hello world' });
});

export default routes;
