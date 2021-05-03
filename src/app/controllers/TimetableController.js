import Joi from '@hapi/joi';
import Timetable from '../models/Timetable';
import Doctor from '../models/Doctor';

class TimetableController {
  async index(req, res) {
    const page = Math.round(req.query.page) > 0 || 1;

    const timetable = await Timetable.findAll({
      offset: page * 10 - 10,
      limit: 10,
      include: [
        {
          model: Doctor,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    return res.json(timetable);
  }

  async store(req, res) {
    const schema = Joi.object({
      doctor_id: Joi.string().uuid(),
      hour: Joi.number().integer().min(0).max(23),
      minute: Joi.number().integer().min(0).max(59),
      weekday: Joi.number().integer().min(0).max(6),
    }).options({ presence: 'required' });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const doctor = await Doctor.findByPk(body.spec_id);

    if (!doctor) {
      return res.status(404).json({ error: 'Specified doctor was not found' });
    }

    try {
      const created = await Timetable.create(body);

      return res.json(created.get({ plain: true }));
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Same timetable for this doctor found' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const timetable = await Timetable.findByPk(id);

    if (!timetable) {
      return res
        .status(400)
        .json({ error: 'Specified timetable was not found' });
    }

    const _deleted = await timetable.destroy();

    return res.json({ message: 'Specified timetable successful deleted' });
  }
}

export default new TimetableController();
