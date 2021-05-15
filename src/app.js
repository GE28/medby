import Express, { json } from 'express';

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { join } from 'path';

import './config/dotenv';

import './app/models'; // starts Sequelize
import './app/models/mongo'; // starts Mongoose

import queue from './queue';

import routes from './routes';
import jsonValidator from './middlewares/jsonValidator';

class App {
  constructor() {
    this.app = Express();
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.middlewares();

    this.app.use(
      morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common')
    );
    this.app.use(routes);

    this.queue();
  }

  middlewares() {
    this.app.use(
      '/static',
      Express.static(
        join(__dirname, process.env.STATIC_PATH || '../../uploads')
      )
    );
    this.app.use(json());
    this.app.use(jsonValidator);
  }

  queue() {
    this.queue = queue;
  }
}

export default new App().app;
