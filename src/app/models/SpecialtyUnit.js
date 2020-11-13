import Sequelize, { Model } from 'sequelize';

class SpecUnit extends Model {
  static init(sequelize) {
    super.init(
      {
        spec_id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        unit_id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
      },
      { sequelize, tableName: 'spec_units' }
    );

    return this;
  }
}

export default SpecUnit;
