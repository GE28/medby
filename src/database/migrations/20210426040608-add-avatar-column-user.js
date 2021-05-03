module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar');
  },
};
