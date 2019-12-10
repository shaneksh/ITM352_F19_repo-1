var express = require('express'); //requires the express package in the node_modules
var app = express(); //starts express
var myParser = require("body-parser"); //need to use bodyParser() to form data to be available in req.body
var products = require("./public/product_data.js"); //defines the products variable and gets data from the product_data.js array
const querystring = require('querystring'); //gives utilities for parsing and formatting URL query strings

// sets public as root folder
app.use("/static", express.static('./public/'));

app.use(myParser.urlencoded({ extended: true })); //tells the system to use JSON
fs = require('fs'); //assigns to a fs variable
var filename = 'staff_data.json'; //assigns information from the user_registartion_info variable

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});