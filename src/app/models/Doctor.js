import Sequelize, { Model, Op } from 'sequelize';

import SpecUnit from './SpecialtyUnit';

class Doctor extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4(),
          primaryKey: true,
        },
        name: Sequelize.STRING(72),
        document: Sequelize.STRING(13),
      },
      { sequelize, tableName: 'doctors' }
    );

    /* Create the association between the medical unit and the specification, if
    it does not already exist */
    this.addHook('afterSave', async (doctor) => {
      if (doctor.unit_id) {
        const { unit_id, spec_id } = doctor;

        const specUnit = await SpecUnit.findOrCreate({
          where: { spec_id, unit_id },
        });
      }
    });

    /* If there is no other doctor with the same specialty working in the unit,
    at the time this doctor gets deleted from system, destroy the association */
    this.addHook('beforeDestroy', async (doctor) => {
      const { unit_id, spec_id, id } = doctor;
      const doctorList = await this.findAll({
        where: {
          unit_id,
          spec_id,
          id: { [Op.not]: id },
        },
      });

      if (!doctorList.length) {
        const specUnit = await SpecUnit.findOne({
          where: { unit_id, spec_id },
        });
        const deleted = await specUnit.destroy();
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Speciality, {
      foreignKey: 'spec_id',
      as: 'specialty',
    });
    this.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
    });
  }
}

export default Doctor;
