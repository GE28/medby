import Mongoose from 'mongoose';

const {
  MONGODB_NAME = 'medby',
  MONGODB_USER = 'mongodb',
  MONGODB_PASS = '',
  MONGODB_HOST = '',
} = process.env;

class MongoDB {
  constructor() {
    this.mongo = Mongoose.connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}/${MONGODB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
  }
}

export default new MongoDB();
