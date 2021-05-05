import Mongoose from 'mongoose';

const AvailableTime = new Mongoose.Schema({
  doctor_id: {
    type: String,
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
    type: String,
    index: true,
    required: true,
  },
  spec_id: {
    type: String,
    index: true,
    required: true,
  },
});

AvailableTime.index({ date: 1, doctor_id: 1 }, { unique: true });

export default Mongoose.model('AvailableTime', AvailableTime);
