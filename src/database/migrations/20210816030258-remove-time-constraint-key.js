module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeConstraint(
      'appointments',
      'appointments_time_key'
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeConstraint(
      'appointments',
      'appointments_time_key'
    );
  },
};
