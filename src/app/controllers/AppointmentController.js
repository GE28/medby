import Joi from '@hapi/joi';
import Appointment from '../models/Appointment';
import AvailableTime from '../models/mongo/AvailableTime';
import Doctor from '../models/Doctor';
import User from '../models/User';
import Specialty from '../models/Specialty';
import Unit from '../models/Unit';

class AppointmentController {
  async index(req, res) {
    const page = Math.round(req.query.page) > 0 || 1;
    const user_id = req.userId || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ error: 'You must provide a user UUID' });
    }

    const appointmentList = await Appointment.findAll({
      offset: page * 10 - 10,
      limit: 10,
      where: {
        user_id,
      },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['name', 'spec_id', 'unit_id'],
          include: [
            {
              model: Specialty,
              as: 'specialty',
              attributes: ['base_price', 'display_name'],
            },
            {
              model: Unit,
              as: 'unit',
              attributes: ['name'],
            },
          ],
        },
        {
          model: User,
          as: 'client',
          attributes: ['name'],
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
        },
        {
          model: User,
          as: 'client',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ error: 'Specified appointment was not found' });
    }

    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You do not have permission to view this appointment' });
    }

    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Joi.object({
      time: Joi.date().required(),
      doctor_id: Joi.string().uuid().required(),
      user_id: Joi.string().uuid(),
    });

    let appointmentData;

    const user_id = req.userId || req.body.user_id;

    try {
      appointmentData = await schema.validateAsync(req.body);

      if (!user_id) {
        return res.status(400).json({ error: 'You must provide a user UUID' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { doctor_id, time } = appointmentData;

    const availableTime = await AvailableTime.findOne({
      doctor_id,
      date: time,
    });

    if (!availableTime) {
      return res.status(403).json({ error: 'Invalid data for an appointment' });
    }

    if (availableTime.taken) {
      return res
        .status(409)
        .json({ error: 'There is another appointment for this time' });
    }

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
        ...appointmentData,
        user_id,
        final_price: doctor.specialty.base_price,
        status: 'S',
      });

      const _updatedTime = await availableTime.update({ taken: true });

      const data = created.get({ plain: true });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error', ...err });
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

    const { cancel } = body;

    const appointment = await Appointment.findByPk(id);

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
        timetable: time,
      });

      const _updated = await appointment.update({ status: 'C' });

      const _updatedTime = await availableTime.update({ taken: false });

      return res.json({ msg: 'Appointment cancelled successfully' });
    }

    return res.json(appointment);
  }
}

export default new AppointmentController();
