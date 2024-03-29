import Bull from 'bull';

import appointmentUpdate from './app/jobs/AppointmentUpdate';
import availabilityJob from './app/jobs/AvailabilityUpdate';

import bullConfig from './config/bull';

class Queue {
  constructor() {
    this.queue = new Bull('updates', bullConfig.redis);
    this.queue.empty();

    this.queue.process('updateTimes', availabilityJob);
    this.queue.add('updateTimes', bullConfig.options);
    this.queue.add('updateTimes', bullConfig.options, {
      // must repeat according to appointments' time interval (15 minutes by default)
      // to correctly show available times
      repeat: { cron: process.env.CRONTAB || '0,15,30,45 * * * *' },
    });

    this.queue.process('updateStatus', appointmentUpdate);
    this.queue.add('updateStatus', bullConfig.options);
    this.queue.add('updateStatus', bullConfig.options, {
      repeat: { cron: process.env.CRONTAB || '0,15,30,45 * * * *' },
    });
  }
}

export default new Queue().queue;
