import Express, { json } from 'express';

import Bull from 'bull';

import './app/models'; // starting Sequelize
import './app/models/mongo'; // starting Mongoose

import routes from './routes';
import jsonValidator from './middlewares/jsonValidator';

import availabilityJob from './app/jobs/AvailabilityUpdate';
import { options, redis } from './config/bull';

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

  queue() {
    this.queue = new Bull('availability', ...redis);

    this.queue.process('updateTimes', availabilityJob);

    this.queue.empty();

    this.queue.add('updateTimes', options, {
      repeat: { cron: '0,15,30,45 * * * *' },
    });
  }
}

export default new App().app;
