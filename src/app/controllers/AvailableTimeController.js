import { addHours, isBefore } from 'date-fns';
import Joi from '@hapi/joi';
import { isValidObjectId } from 'mongoose';

import AvailableTime from '../models/mongo/AvailableTime';
import Doctor from '../models/Doctor';
import Specialty from '../models/Specialty';
import Unit from '../models/Unit';

const getFutureDays = () => {
  const futureWeeks = Number(process.env.FUTURE_WEEKS) || 3;
  return futureWeeks * 7;
};

class AvailableTimeController {
  async index(req, res) {
    const minPastHours = Number(process.env.PAST_HOURS);

    const metadata = { maxAllowedDaysInFuture: getFutureDays(), count: null };

    const { config_only } = req.query;
    if (config_only > 0) return res.json({ metadata });

    const filters = Joi.object({
      min_date: Joi.date().iso(),
      max_date: Joi.date().iso(),
      page: Joi.number().integer().min(1).default(1),
      doctor_id: Joi.string().uuid(),
      unit_id: Joi.string().uuid(),
      spec_id: Joi.string().uuid().required(),
    }).unknown(true);

    let query;

    try {
      query = await filters.validateAsync(req.query);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request', ...{ err } });
    }

    const { max_date, page } = query;
    delete query.max_date;
    delete query.page;

    const minAllowedDate = addHours(new Date(), minPastHours);
    const min_date = isBefore(minAllowedDate, query.min_date)
      ? query.min_date
      : minAllowedDate;
    delete query.min_date;

    const options = {
      ...query,
      taken: false,
      date: {
        $gte: min_date,
        ...(max_date && { $lt: max_date }),
      },
    };

    const availableTimeList = await AvailableTime.find(options)
      .skip(page * 10 - 10)
      .limit(10);

    metadata.count = await AvailableTime.countDocuments(options);

    return res.json({
      data: [...availableTimeList],
      metadata,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const availableTime = await AvailableTime.findById(id);

    if (!availableTime) {
      return res
        .status(403)
        .json({ error: 'Specified register was not found' });
    }

    const { doctor_id, date: time } = availableTime;

    try {
      const doctor = await Doctor.findByPk(doctor_id, {
        include: [
          {
            model: Unit,
            as: 'unit',
            attributes: {
              exclude: ['created_at', 'updated_at'],
            },
          },
          {
            model: Specialty,
            as: 'specialty',
            attributes: {
              exclude: ['created_at', 'updated_at'],
            },
          },
        ],
        exclude: ['created_at', 'updated_at'],
        raw: true,
        nest: true,
      });

      return res.json({
        aT_id: id,
        aT_date: time,
        final_price: doctor.specialty.base_price,
        doctor,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AvailableTimeController();
