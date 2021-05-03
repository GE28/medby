/* eslint-disable no-useless-catch */
import { addDays, addHours, isAfter } from 'date-fns';

import Timetable from '../models/Timetable';
import Doctor from '../models/Doctor';
import AvailableTime from '../models/mongo/AvailableTime';

import formatTimetable from '../utils/formatTimetable';

export default async (job) => {
  try {
    const { allowedFutureWeeks } = job.data;

    const { minPastHours } = job.data;

    const refDate = addHours(new Date(), minPastHours);

    const today = refDate.getDay();

    let timetables = await Timetable.findAll({
      order: ['timetable'],
      include: {
        model: Doctor,
        as: 'doctor',
        attributes: ['spec_id', 'unit_id'],
      },
    });

    // '3-18-00' => wed 18:00
    // '0-20-30' => sun 20:30
    timetables = formatTimetable(timetables);

    const nextAvailableTimes = [];

    timetables.forEach((timetable) => {
      // If this week's Wednesday is over, use next week's Wednesday instead
      let { weekday } = timetable;

      const { doctor_id, minute, hour, spec_id, unit_id } = timetable;

      weekday = weekday < today ? weekday + 7 : weekday;

      // Select all days matching weekday until the next (X) week(s)
      for (let i = weekday; i < today + 7 * allowedFutureWeeks; i += 7) {
        // Generate the next available times for appointments using a date as reference
        let date = new Date(refDate);
        date = addDays(date, i - today);
        date.setHours(hour, minute, 0, 0);

        if (isAfter(date, refDate)) {
          nextAvailableTimes.push({ doctor_id, date, spec_id, unit_id });
        }
      }
    });

    const _deleted = await AvailableTime.deleteMany({
      $or: [
        { date: { $lt: refDate } },
        { date: { $gt: addDays(refDate, allowedFutureWeeks * 7) } },
      ],
    });

    const _created = await AvailableTime.create(nextAvailableTimes);
  } catch (err) {
    throw err;
  }
};
