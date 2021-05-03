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
    required: true,
  },
  spec_id: {
    type: String,
    required: true,
  },
});

AvailableTime.index({ doctor_id: 1, date: 1 }, { unique: true });

export default Mongoose.model('AvailableTime', AvailableTime);
