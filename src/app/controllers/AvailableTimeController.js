import { addHours } from 'date-fns';
import Joi from '@hapi/joi';

import AvailableTime from '../models/mongo/AvailableTime';

class AvailableTimeController {
  async index(req, res) {
    const minPastHours = process.env.PAST_HOURS;

    const querySchema = Joi.object({
      min_date: Joi.date(),
      max_date: Joi.date(),
      page: Joi.number().integer().min(1).default(1),
    });

    const bodySChema = Joi.object({
      doctor_id: Joi.string().uuid(),
      unit_id: Joi.string().uuid(),
      spec_id: Joi.string().uuid(),
    });

    let query, body;

    try {
      query = await querySchema.validateAsync(req.query);
      body = await bodySChema.validateAsync(req.body);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Bad request', details: { ...err } });
    }

    const { page, max_date } = query;
    const min_date = query.min_date || addHours(new Date(), minPastHours);

    const availableTimeList = await AvailableTime.find({
      ...body,
      taken: false,
      date: {
        $gte: min_date,
        ...(max_date && { $lt: max_date }),
      },
    })
      .skip(page * 10 - 10)
      .limit(10);

    return res.json(availableTimeList);
  }
}

export default new AvailableTimeController();
