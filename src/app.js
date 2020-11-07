import Express, { json } from 'express';

import routes from './routes';

class App {
  constructor() {
    this.app = new Express();

    this.middlewares();
    this.app.use(routes);
  }

  middlewares() {
    this.app.use(json());
  }
}

export default new App().app;
