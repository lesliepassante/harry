'use strict';

var _           = require('lodash');
var cocktails   = require('./data/cocktails.json');
var ingredients = require('./data/ingredients.json');

var Craddock = {};

Craddock.ask = function(options, callback) { 
  /*var pyshell = new PythonShell('./craddock/craddock', { mode: 'json' });
  console.log(JSON.stringify(options))  
  pyshell
    .send(JSON.stringify(options))
    .on('message', function (message) {
      console.log(message);
      callback(null, message);
    })
    .end(function(err) {
      console.log(err);
      callback(err);
    });
  */
};

module.exports = Craddock;