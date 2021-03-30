'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('build_stories', {

      userid: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userid"
        }
      },

      unhide_usermindid: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "unhide_userminds",
          key: "unhide_usermindid"
        }
      },

      part_of_realid: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "part_of_reals",
          key: "part_of_realid"
        }
      },

      datetime_join: {
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
    await queryInterface.bulkDelete('build_stories', null, {}); 
  }
};
