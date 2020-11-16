import Sequelize, { Model } from 'sequelize';

class Timetable extends Model {
  static init(sequelize) {
    super.init(
      {
        timetable: {
          type: Sequelize.STRING(7),
          primaryKey: true,
        },
      },
      { sequelize, tableName: 'timetables' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });
  }
}

export default Timetable;
