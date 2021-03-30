'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('friend_relates', {

      userid: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        primaryKey: true,
        references: {
          model: "users",
          key: "userid"
        }
      },

      friendid: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        primaryKey: true,
        references: {
          model: "users",
          key: "userid"
        }
      },

      datetime_makefriend: {
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
    await queryInterface.bulkDelete('friend_relates', null, {});
  }
};
