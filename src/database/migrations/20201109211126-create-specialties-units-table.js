module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('spec_units', {
      spec_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'specialties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      unit_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('spec_units');
  },
};
