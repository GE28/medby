const {
  REDIS_HOST: host = '',
  REDIS_PORT = '6379',
  REDIS_PASSWORD = '',
} = process.env;

const REDIS_HOST = `${host}:${REDIS_PORT}`;

export default {
  options: {
    // the client can book an appointment for up to (value) weeks after the current date
    allowedFutureWeeks: Number(process.env.FUTURE_WEEKS) || 3,
    // the client can book or cancel an appointment up to (value) hours before it's time
    minPastHours: Number(process.env.PAST_HOURS) || 6,
  },
  redis: {
    url: process.env.REDIS_URL || `redis://:${REDIS_PASSWORD}@${REDIS_HOST}`,
  },
};
