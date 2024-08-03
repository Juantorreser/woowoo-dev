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
        // client: {    //Can not seem to connect the two tables
        //   primaryKey: true,
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: 'users', // <<< Note, its table's name, not object name
        //     key: 'uid' // <<< Note, its a column name
        //   }, 
        //   onDelete: 'cascade', 
        //   onUpdate: 'cascade'
        // },
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
        },
        appointmentService: {
          type: Sequelize.STRING
        },
        appointmentDuration: {
          type: Sequelize.STRING
        }
    },
    { 
      tableName: 'appointments'
    }
  );

    return appointment;
  };
