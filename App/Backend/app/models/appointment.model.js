const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const appointment = sequelize.define("appointment", {
        aid: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
        healer: {
          type: Sequelize.STRING
        },    
        client: {
          type: Sequelize.STRING
        },
        timezone: {
          type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        time: {
            type: Sequelize.STRING
        },
        healerAccepted: {
            type: Sequelize.BOOLEAN
        }
    },
    { 
      tableName: 'appointments'
    }
  );

    return appointment;
  };
