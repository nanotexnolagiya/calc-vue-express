'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('History', {
    ip: DataTypes.STRING,
    task: DataTypes.STRING,
    result: DataTypes.STRING
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};