//* must be run first npm install request --save 
var request = require("request");
const googleConfig = require("../config/google.config.js");

exports.FindByKeyWord = async function (req, res, next) {
    
    return new Promise(function (resolve, reject) {

    var API_KEY = googleConfig.API_KEY;
    var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";

    var url = BASE_URL + req.body.address + "&key=" + API_KEY;

    console.log("About to define geocode!");
    
    request(url, function (error, res, body) {

        if (!error && res.statusCode == 200) {
           resolve(res.body)
        }
        else {
            reject(error);
            // The request failed, handle it
        }

    });





    });
}


