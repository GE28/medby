import Express, { json } from 'express';

import './app/models'; // starting Sequelize
import './app/models/mongo'; // starting Mongoose

import routes from './routes';
import jsonValidator from './middlewares/jsonValidator';

class App {
  constructor() {
    this.app = new Express();

    this.middlewares();
    this.app.use(routes);
  }

  middlewares() {
    this.app.use(json());
    this.app.use(jsonValidator);
  }
}

export default new App().app;
