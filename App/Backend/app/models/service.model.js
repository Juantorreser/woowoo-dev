const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const service = sequelize.define("service", {
      sid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uid: {
        type: Sequelize.INTEGER
      },
      service: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    },
    { 
      tableName: 'services'
    });
    return service;
  };
