module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('specialties', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      base_price: {
        type: Sequelize.DECIMAL(7, 2),
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
    return queryInterface.dropTable('specialties');
  },
};
