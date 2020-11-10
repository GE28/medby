import Sequelize, { Model } from 'sequelize';

class Unit extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING(56),
        address: Sequelize.VIRTUAL(355),
        cep: Sequelize.STRING(8),
        complements: Sequelize.STRING,
      },
      { sequelize, tableName: 'units' }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Doctor, { foreignKey: 'unit_id', as: 'doctors' });
    this.belongsToMany(models.Speciality, {
      through: 'spec_units',
      foreignKey: 'unit_id',
      as: 'specialties',
    });
  }
}

export default Unit;
