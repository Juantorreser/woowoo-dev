//const { user } = require(".");
//this file shows how the location table is structured in the database
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const location = sequelize.define("location", {
        lid: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
        uid: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          references: {
            model: 'users', // <<< Note, its table's name, not object name
            key: 'uid' // <<< Note, its a column name
          }
        },
        fbid: {
          type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING,
        },
        lat: {
            type: Sequelize.FLOAT(13, 10)
        },
        lng: {
            type: Sequelize.FLOAT(13, 10)
        }
    },
    {
      tableName: 'locations'
    }
  );

    return location;
  };
