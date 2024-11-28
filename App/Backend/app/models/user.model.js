const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  // Define the "user" model
  const user = sequelize.define(
    "user",
    {
      uid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fbid: {
        type: Sequelize.STRING,
        comment: "Firebase ID (optional field)",
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Indicates if the user's email is verified",
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Ensures the field is not empty
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure email uniqueness
        validate: {
          isEmail: true, // Validate email format
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "User's hashed password",
      },
      account: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: "Account type (1 = default)",
      },
      services: {
        type: Sequelize.STRING,
        comment: "Comma-separated list of services offered by the healer",
      },
      description: {
        type: Sequelize.STRING,
        comment: "User's description or bio",
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "Whether the user account is enabled or disabled",
      },
      region: {
        type: Sequelize.STRING,
        comment: "User's region (e.g., 'CA' for Canada)",
      },
      city: {
        type: Sequelize.STRING,
        comment: "User's city",
      },
      role: {
        type: DataTypes.ENUM("healer", "client", "admin"),
        allowNull: false,
        defaultValue: "client",
        comment: "User role: 'healer', 'client', or 'admin'",
      },
      format: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: "Custom format preferences (optional)",
      },
      stripeAccount: {
        type: Sequelize.STRING,
        comment: "Stripe account ID for payment processing",
      },
      servicePrices: {
        type: Sequelize.STRING,
        comment: "Comma-separated list of service prices (optional)",
      },
    },
    {
      tableName: "users",
    }
  );

  return user;
};
