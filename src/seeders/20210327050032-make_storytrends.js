'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('make_storytrends', {

      maketter: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userid"
        }

      },

      sheep: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userid"
        }
      },

      storyid: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "part_of_reals",
          key: "part_of_realid"
        }
      },

      datetime_maketrend: {
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
    await queryInterface.bulkDelete('make_storytrends', null, {});
  }
};
