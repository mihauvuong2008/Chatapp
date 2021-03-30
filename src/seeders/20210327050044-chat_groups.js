'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('chat_groups', {

      groupid: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      group_name: {
        type: Sequelize.STRING,
        notEmpty: true
      },

      creator: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: "users",
          key: "userid"
        }
      },

      datetime_create: {
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
    await queryInterface.bulkDelete('chat_groups', null, {}); 
  }
};
