import Mongoose from 'mongoose';

const Schedule = new Mongoose.Schema({
  doctor_id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  taken: {
    type: Boolean,
    required: true,
    default: false,
  },
  unit_id: {
    type: Number,
    required: true,
  },
  spec_id: {
    type: Number,
    required: true,
  },
});

Schedule.index({ doctor_id: 1, date: 1 }, { unique: true });

export default Mongoose.model('Schedule', Schedule);
