//const { user } = require(".");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const review = sequelize.define("review", {
            rid: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
            },
            reviewer: {
                type: DataTypes.STRING,
            },
            reviewee: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users', // <<< Note, its table's name, not object name
                    key: 'uid' // <<< Note, its a column name
                }
            },
            rating: {
                type: Sequelize.INTEGER,
            },
            comment: {
                type: Sequelize.STRING,
            }
        },
        {
            tableName: 'reviews'
        }
    );

    return review;
};
