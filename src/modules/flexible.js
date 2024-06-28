'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flexible extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flexible.init({
    userId: DataTypes.STRING,
    capitalSatisfaction: DataTypes.DOUBLE,
    unwithdrawnProfits: DataTypes.DOUBLE,
    profitWithdrawn: DataTypes.DOUBLE,
    capitalAwaitingApproval: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Flexible',
  });
  return Flexible;
};