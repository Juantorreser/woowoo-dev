
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");   //sequelize package helps generate complex queries to get to the db

//instantiates sequelize to connect api to mysql database
const sequelize = new Sequelize("woowoodev", "root", null, {
  password: null,
  operatorsAliases: 0,
  dialect: "mysql",
  port: 8888,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.image = require("./image.model.js")(sequelize, Sequelize);
db.location = require("./location.model.js")(sequelize, Sequelize);
db.social = require("./social.model.js")(sequelize, Sequelize);
db.service = require("./service.model.js")(sequelize, Sequelize);
db.review = require("./review.model.js")(sequelize, Sequelize);
db.appointment = require("./appointment.model.js")(sequelize, Sequelize);
db.availability = require("./availability.model.js")(sequelize, Sequelize);

//many images to one user

module.exports = db;
