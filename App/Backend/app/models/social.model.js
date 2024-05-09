//const { user } = require(".");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const social = sequelize.define("social", {
        uid: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          references: {
            model: 'users', // <<< Note, its table's name, not object name
            key: 'uid' // <<< Note, its a column name
          }
        },
        type: {
            type: Sequelize.STRING,
          },
        tag: {
            primaryKey: true,
            type: Sequelize.STRING,
          },
    },{ tableName: 'socials'
});

    return social;
  };
