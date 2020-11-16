import Mongoose from 'mongoose';

class MongoDB {
  constructor() {
    this.mongo = Mongoose.connect('mongodb://localhost:27017/medby', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
}

export default new MongoDB();
