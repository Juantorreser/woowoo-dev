const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const availability = sequelize.define("availability", {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
        healer: {
          type: Sequelize.STRING
        },    
        timeslots: {
          type: Sequelize.STRING
        },
        timezone: {
          type: Sequelize.STRING
        },
        duration: {
            type: Sequelize.STRING
        }
    },
    { 
      tableName: 'availability'
    }
  );

    return availability;
  };
