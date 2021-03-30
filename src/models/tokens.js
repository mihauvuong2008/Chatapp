'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Tokens.init({
    accesstoken: DataTypes.STRING,
    refreshtoken: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'tokens',
    timestamps: false,
    updatedAt: false,
  });
  return Tokens;
};
