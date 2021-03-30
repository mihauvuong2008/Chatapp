'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('friend_requests', {
      partnerid: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        primaryKey: true,
        references: {
          model: "users",
          key: "userid"
        }
      },
      userid: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        primaryKey: true,
        references: {
          model: "users",
          key: "userid"
        }
      },
      datetimesendrequest: {
        type: Sequelize.DATE
      },
    },
    {
    timestamps: false,
    // If don't want createdAt
    createdAt: false,
    // If don't want updatedAt
    updatedAt: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('friend_requests');
  }
};
