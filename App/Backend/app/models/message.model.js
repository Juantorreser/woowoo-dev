const {DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize)=> {
    const message = sequelize.define("message", {
        mid: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            },
        context: {
            type: Sequelize.STRING
        },
        from_user: {
            type: Sequelize.STRING
        }, 
        to_user: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE
        }
    });
    return message;
}