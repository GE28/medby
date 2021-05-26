import { addHours } from 'date-fns';
import Joi from '@hapi/joi';

import AvailableTime from '../models/mongo/AvailableTime';

class AvailableTimeController {
  async index(req, res) {
    const minPastHours = 1;

    const schema = Joi.object({
      doctor_id: Joi.string().uuid(),
      min_date: Joi.date().default(addHours(new Date(), minPastHours)),
      max_date: Joi.date(),
      unit_id: Joi.string().uuid(),
      spec_id: Joi.string().uuid(),
      page: Joi.number().integer().min(1).default(1),
    });

    let query;

    try {
      query = await schema.validateAsync(req.query);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { doctor_id, spec_id, unit_id, page } = query;

    const filter = {
      ...(doctor_id && { doctor_id }),
      ...(spec_id && { spec_id }),
      ...(unit_id && { unit_id }),
    };

    const availableTimeList = await AvailableTime.find(filter)
      .skip(page * 10 - 10)
      .limit(10);

    return res.json(availableTimeList);
  }
}

export default new AvailableTimeController();
