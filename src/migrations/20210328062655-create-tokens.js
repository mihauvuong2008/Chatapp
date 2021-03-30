'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accesstoken: {
        type: Sequelize.STRING
      },
      refreshtoken: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      }
    },
    {
    timestamps: false,
    // If don't want updatedAt
    updatedAt: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tokens');
  }
};
