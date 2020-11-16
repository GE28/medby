export default (timetables) =>
  timetables.map((timetable) => {
    const { doctor_id } = timetable;
    const { spec_id, unit_id } = timetable.doctor;

    let arr = timetable.timetable.split('-');
    arr = arr.map((n) => Number(n));
    const [weekday, hour, minute] = arr;

    return { doctor_id, hour, minute, weekday, spec_id, unit_id };
  });
