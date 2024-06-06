// const { DataTypes } = require("sequelize");

// module.exports = (sequelize, Sequelize) => {
//     const availability = sequelize.define("availability", {
//         id: {
//             primaryKey: true,
//             autoIncrement: true,
//             type: DataTypes.INTEGER,
//           },
//         healer: {
//           type: Sequelize.STRING
//         },    
//         timeslots: {
//           type: Sequelize.STRING
//         },
//         timezone: {
//           type: Sequelize.STRING
//         },
//         duration: {
//             type: Sequelize.STRING
//         }
//     },
//     { 
//       tableName: 'availability'
//     }
//   );

//     return availability;
//   };
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Availability = sequelize.define("Availability", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        healer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeslots: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                // This getter will parse the timeslots string into an array
                const rawValue = this.getDataValue('timeslots');
                return rawValue ? rawValue.split(',') : [];
            },
            set(value) {
                // This setter will join an array into a string for storage
                this.setDataValue('timeslots', Array.isArray(value) ? value.join(',') : value);
            },
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'availability',
        timestamps: true, // if you have createdAt and updatedAt columns
    });

    return Availability;
};
