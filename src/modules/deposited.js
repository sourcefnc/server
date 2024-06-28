'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deposited extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Deposited.init({
    userId: DataTypes.STRING,
    value: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Deposited',
  });
  return Deposited;
};