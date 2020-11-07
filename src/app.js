import Express, { json } from 'express';

import Connection from './app/models'; // starting Sequelize
import routes from './routes';

class App {
  constructor() {
    this.app = new Express();

    this.middlewares();
    this.app.use(routes);
    this.app.use('/connection', (req, res) => {
      const { sequelize } = Connection;
      return res.json({ sequelize: !!sequelize });
    });
  }

  middlewares() {
    this.app.use(json());
  }
}

export default new App().app;
