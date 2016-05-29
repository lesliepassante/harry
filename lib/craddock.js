'use strict';

var _           = require('lodash');
var cocktails   = require('./data/cocktails.json');
var ingredients = require('./data/ingredients.json');
var response    = require('./data/example-response.json');

var Craddock = {};

Craddock.ask = function(options) { 
  return new Promise(function(resolve, reject) {  
    resolve(response);
  });
};

module.exports = Craddock;