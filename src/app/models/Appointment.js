import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4(),
          primaryKey: true,
        },
        time: Sequelize.DATE,
        final_price: Sequelize.DECIMAL(7, 2),

        /* 'S': scheduled (default); 'C': canceled; 
           'B': canceled (belatedly); 'D': done */
        status: Sequelize.STRING(1),
      },
      { sequelize, tableName: 'appointments' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'client',
    });
  }
}

export default Appointment;
