'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('part_of_reals', {

      part_of_realid: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      datetime_split: {
        type: Sequelize.DATE
      }
    },
    {

      timestamps: false,

      // If don't want createdAt
      createdAt: false,

      // If don't want updatedAt
      updatedAt: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('part_of_reals', null, {});
  }
};
