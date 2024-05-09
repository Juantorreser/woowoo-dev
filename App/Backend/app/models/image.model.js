//const { user } = require(".");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const image = sequelize.define("image", {

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
          name: {
            primaryKey: true,
            type: Sequelize.STRING,
          },
          data: {
            type: Sequelize.BLOB("long"),
          }
    },{ tableName: 'images'
});

    return image;
  };
