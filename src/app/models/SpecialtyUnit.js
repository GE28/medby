import Sequelize, { Model } from 'sequelize';

class SpecUnit extends Model {
  static init(sequelize) {
    super.init(
      {
        spec_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        unit_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      },
      { sequelize, tableName: 'spec_units' }
    );

    return this;
  }
}

export default SpecUnit;
