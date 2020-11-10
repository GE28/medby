module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('doctors', 'unit_id', {
      type: Sequelize.UUID,
      references: { model: 'units', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    return queryInterface.addColumn('doctors', 'spec_id', {
      type: Sequelize.UUID,
      references: { model: 'specialties', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('doctors', 'unit_id');
    return queryInterface.removeColumn('doctors', 'spec_id');
  },
};
