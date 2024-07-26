'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reward.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Reward.init({
    day: DataTypes.INTEGER,
    state: DataTypes.INTEGER,
    claimStartDate: DataTypes.DATE,
    claimEndDate: DataTypes.DATE,
    coin: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};