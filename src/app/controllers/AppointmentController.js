import Joi from '@hapi/joi';
import Appointment from '../models/Appointment';
import AvailableTime from '../models/mongo/AvailableTime';
import Doctor from '../models/Doctor';
import User from '../models/User';
import Speciality from '../models/Specialty';

class AppointmentController {
  async index(req, res) {
    const page = Math.round(req.query.page) || 1;

    const appointmentList = await Appointment.findAll({
      offset: page * 10 - 10,
      limit: 10,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['name', 'spec_id', 'unit_id'],
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
    const user_id = req.userId;

    const schema = Joi.object({
      time: Joi.date(),
      doctor_id: Joi.number().integer().min(1),
    }).options({ presence: 'required' });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { doctor_id, time } = body;

    const availableTime = await AvailableTime.findOne({
      doctor_id,
      date: time,
    });

    const refDoctor = await Doctor.findByPk(user_id);

    if (!refDoctor) {
      return res.status(400).json({ error: 'Specified doctor was not found' });
    }

    if (!availableTime) {
      return res
        .status(404)
        .json({ error: 'Invalid time to schedule the appointment' });
    }

    if (availableTime.taken) {
      return res
        .status(409)
        .json({ error: 'There is another appointment for this time' });
    }

    const { base_price } = await Speciality.findByPk(refDoctor.spec_id);

    body.user_id = user_id;
    body.final_price = base_price;
    body.status = 'S';

    try {
      const created = await Appointment.create(body);

      const updatedTime = await availableTime.update({ taken: true });

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

      const updated = await appointment.update({ status: 'C' });

      const updatedTime = await availableTime.update({ taken: false });

      return res.json({ msg: 'Appointment cancelled successfully' });
    }

    return res.json(appointment);
  }
}

export default new AppointmentController();
