import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

export default async () => {
  await Appointment.update(
    { status: 'D' },
    {
      where: {
        time: { [Op.lte]: new Date() },
        status: 'S',
      },
    }
  );
};
