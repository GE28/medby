import Sequelize, { Model } from 'sequelize';

class Speciality extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING(32),
        display_name: Sequelize.STRING(32),
        base_price: Sequelize.DECIMAL(11, 2),
      },
      { sequelize, tableName: 'specialties' }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Doctor, { foreignKey: 'spec_id', as: 'doctors' });
    this.belongsToMany(models.Unit, {
      through: 'spec_units',
      foreignKey: 'spec_id',
      as: 'units',
    });
  }
}

export default Speciality;
