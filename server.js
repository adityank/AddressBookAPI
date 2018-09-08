/*
 * Author: Aditya Kamble
 * September 2018
 *
 * REST API server serving address book queries
 *
 */



// dependencies
var express = require('express');        
var app 	= express(); 
var router 	= express.Router();
var route 	= require('./routes/route');
var bodyParser = require('body-parser');


// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        

// Register the routes 
app.use('/',route);

// Start the server 
app.listen(port);

console.log('Starting AddressBook server on port ' + port);

