'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('say_to_groups', {

      tellerid: {
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

      groupid: {
        type: Sequelize.INTEGER,
        references: {
          model: "chat_groups",
          key: "groupid"
        }
      },

      datetime_tell: {
        type: Sequelize.DATE
      },
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
    await queryInterface.bulkDelete('say_to_groups', null, {});
  }
};