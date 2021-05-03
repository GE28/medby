export default {
  options: {
    // Session expiration time [zeit/ms](https://github.com/zeit/ms.js)
    expiresIn: process.env.EXPIRATION || '1d',
  },
  // String used by JWT to generate the token
  secret: process.env.SECRET_KEY || 'mysecretkey',
};
