const express = require("express");
const app = express();
const cors = require("cors");
global.__basedir = __dirname;
const db = require("./app/models/index.js");
const sql = require("mysql2");
const config = require("./app/config/db.config");
const router = express.Router();
const stripeConfig = require("./app/config/stripe.config.js");
const Stripe = require ('stripe');
const stripeAPI = new Stripe(stripeConfig.STRIPE_API_KEY);
const appSecret = stripeConfig.STRIPE_SECRET_KEY;

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public/imgs'));

require("./app/routes/api-router.js")(app);

var corsOptions = {
  origin: "http://localhost:4200"
};

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

let connection = sql.createConnection({
  host: config.HOST,
  user: config.USER,
  database: config.DB
});

connection.connect(err =>  {
  if(err) 
    console.log('DataBase Connection Error');
});

//simple routing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to WWN!" });

});

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on port ${PORT}.`);
});
