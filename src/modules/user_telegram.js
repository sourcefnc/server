'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Telegram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Telegram.init({
    username: DataTypes.STRING,
    userId: DataTypes.STRING,
    withdrawRequest: DataTypes.DOUBLE,
    walletAddress: DataTypes.STRING,
    balance: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'User_Telegram',
  });
  return User_Telegram;
};