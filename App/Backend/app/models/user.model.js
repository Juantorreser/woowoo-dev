const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {    //is the same as normal export.
  
    const user = sequelize.define("user", {
      uid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fbid: {
        //allowNull: false,
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.INTEGER
      },
      services: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.BOOLEAN
      }, 
      region: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      format: {
        type: Sequelize.INTEGER
      }, 
      stripeAccount: {
        type: Sequelize.STRING
      }
    },
    { 
      tableName: 'users'
    });
   
    
    return user;
  };
