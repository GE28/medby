module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('doctors', 'avatar', {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('doctors', 'avatar');
  },
};
