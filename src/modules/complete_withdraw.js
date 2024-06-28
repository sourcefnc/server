'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complete_Withdraw extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Complete_Withdraw.init({
    userId: DataTypes.STRING,
    value: DataTypes.DOUBLE,
    transaction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Complete_Withdraw',
  });
  return Complete_Withdraw;
};