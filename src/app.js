import Express, { json } from 'express';

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import Bull from 'bull';

import { join } from 'path';

import './config/dotenv';

import './app/models'; // starts Sequelize
import './app/models/mongo'; // starts Mongoose

import routes from './routes';
import jsonValidator from './middlewares/jsonValidator';

import availabilityJob from './app/jobs/AvailabilityUpdate';

import bullConfig from './config/bull';

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

    this.app.use(morgan('common'));
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
    this.queue = new Bull('availability', bullConfig.redis);

    this.queue.empty();

    this.queue.process('updateTimes', availabilityJob);

    this.queue.add('updateTimes', bullConfig.options);

    this.queue.add('updateTimes', bullConfig.options, {
      // must repeat according to appointments' time interval (15 minutes by default)
      // to correctly show available times
      repeat: { cron: process.env.CRONTAB || '0,15,30,45 * * * *' },
    });
  }
}

export default new App().app;
