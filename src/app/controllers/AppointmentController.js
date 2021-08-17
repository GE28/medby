import Joi from '@hapi/joi';
import { isValidObjectId } from 'mongoose';

import Appointment from '../models/Appointment';
import AvailableTime from '../models/mongo/AvailableTime';
import Doctor from '../models/Doctor';
import User from '../models/User';
import Specialty from '../models/Specialty';
import Unit from '../models/Unit';

class AppointmentController {
  async index(req, res) {
    const page = Math.round(req.query.page) > 0 || 1;

    const showRest = req.query.show_rest || false;

    const user_id = req.userId || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ error: 'You must provide a user UUID' });
    }

    const appointmentList = await Appointment.findAll({
      ...(showRest
        ? { offset: (page + 1) * 10 - 10 }
        : { offset: page * 10 - 10, limit: 10 }),
      where: {
        user_id,
        status: 'S',
      },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['display_name'],
            },
            {
              model: Unit,
              as: 'unit',
              attributes: {
                exclude: ['created_at', 'updated_at'],
              },
            },
          ],
        },
        {
          model: User,
          as: 'client',
          attributes: {
            exclude: ['avatar', 'password_hash', 'created_at', 'updated_at'],
          },
        },
      ],
    });

    return res.json(appointmentList);
  }

  async show(req, res) {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['display_name'],
            },
            {
              model: Unit,
              as: 'unit',
              attributes: {
                exclude: ['created_at', 'updated_at'],
              },
            },
          ],
        },
        {
          model: User,
          as: 'client',
          attributes: {
            exclude: ['password_hash', 'created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ error: 'Specified appointment was not found' });
    }

    if (req.userType === 'U' && appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You do not have permission to view this appointment' });
    }

    return res.json(appointment);
  }

  async store(req, res) {
    const { available_time_id } = req.body;

    if (!isValidObjectId(available_time_id)) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const user_id = req.userId || req.body.user_id;

    try {
      await Joi.string().uuid().validateAsync(user_id);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const availableTime = await AvailableTime.findById(available_time_id);
    if (!availableTime) {
      return res.status(403).json({ error: 'Invalid data for an appointment' });
    }

    if (availableTime.taken) {
      return res
        .status(409)
        .json({ error: 'There is another appointment for this time' });
    }

    const { doctor_id, date: time } = availableTime;

    const doctor = await Doctor.findByPk(doctor_id, {
      include: [
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['base_price'],
        },
      ],
    });

    try {
      const created = await Appointment.create({
        doctor_id,
        user_id,
        time,
        final_price: doctor.specialty.base_price,
        status: 'S',
      });

      const _updatedTime = await availableTime.update({ taken: true });

      const data = created.get({ plain: true });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Joi.object({
      cancel: Joi.boolean(),
    });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const appointment = await Appointment.findByPk(id);
    const { cancel } = body;

    if (!appointment) {
      return res
        .status(400)
        .json({ error: 'Specified appointment was not found' });
    }

    if (appointment.user_id !== req.userId) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to edit this appointment' });
    }

    const { doctor_id, time } = appointment;

    if (cancel) {
      const availableTime = await AvailableTime.findOne({
        doctor_id,
        date: time,
      });

      if (!availableTime) {
        const _updated = await appointment.update({ status: 'B' });
        return res
          .status(409)
          .json({ msg: 'Appointment cancelled successfully (belatedly)' });
      }

      const _updated = await appointment.update({ status: 'C' });
      const _updatedTime = await availableTime.update({ taken: false });

      return res.json({ msg: 'Appointment cancelled successfully' });
    }

    return res.json(appointment);
  }
}

export default new AppointmentController();
