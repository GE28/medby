module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('timetables', {
      doctor_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      timetable: {
        type: Sequelize.STRING(7),
        primaryKey: true,
        allowNull: false,
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
    return queryInterface.dropTable('timetables');
  },
};
