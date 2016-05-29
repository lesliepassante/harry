'use strict';

var _           = require('lodash');
var cocktails   = require('./data/cocktails.json');
var ingredients = require('./data/ingredients.json');

function main() {
  var request = require('./examples/bar1.json')

  // Construct a set of everything in the bar explicitly or implicitly.
  var bar = scan_bar(request['ingredients'], new Set());

  // Filter out cocktails that don't match the current season or are in
  // the cocktail exclusion list.
  var drinks = exclude(request['season'], new Set(request['exclude']));

  // Compute scores for all the remaining cocktails.
  var scores = compute_scores(bar, drinks);

  // TODO: needs the interaction with Lambda
  console.log(scores);
}

function intersects(set_a, set_b) {
  set_a.forEach(function(x) {
    if (set_b.has(x))
      return true;
  });
  return false;
}

function scan_bar(explicit_stock, complete_stock) {
  for (var i = 0; i < explicit_stock.length; i++) {
    var ingredient = explicit_stock[i];

    if (!complete_stock.has(ingredient)) {
      complete_stock.add(ingredient);

      if (ingredient in ingredients)
        scan_bar(ingredients[ingredient], complete_stock).forEach(function(k) {
          complete_stock.add(k);
        });
    }
  }

  return complete_stock;
}

function exclude(season, black_list) {
  // Make a shallow copy of the cocktails list.
  var acceptable_drinks = {};
  Object.keys(cocktails).forEach(function(k) {
    var ok = true;
    if (season) {
      var seasons = new Set(cocktails[k]['seasons']);
      if (!(seasons.has('*') || seasons.has(season)) || black_list.has(k))
        ok = false;
    }

    if (ok)
      acceptable_drinks[k] = cocktails[k];
  });

  return acceptable_drinks;
}

function score(bar, ingredients) {
  if (ingredients.length < 1 || bar.length < 1)
    return 0.0;

  var score = 0.0;
  ingredients.forEach(function(i) {
    if (Array.isArray(i)) {
      if (intersects(bar, new Set(i)))
        score += 1.0;
    } else {
      if (bar.has(i))
        score += 1.0;
    }
  });

  return +(score / ingredients.length).toFixed(2);
}

function compute_scores(bar, drinks) {
  var scores = [];
  for (var drink in drinks) {
    var recipe = drinks[drink];

    // console.log(recipe['required']);
    scores.push({
      'name': drink,
      'recipe': {
        'required': recipe['required'],
        'optional': recipe['optional'],
        'preferred': recipe['preferred'],
        'seasons': recipe['seasons']
      },
      'scores': {
        'required': score(bar, recipe['required']),
        'optional': score(bar, recipe['optional']),
        'preferred': score(bar, recipe['preferred'])
      }
    });
  }

  scores.sort(compare_scores);
  return scores;
}

function compare_scores(d1, d2) {
  if (d2['scores']['required'] < d1['scores']['required'])
    return -1;
  if (d2['scores']['required'] > d1['scores']['required'])
    return 1;
  if (d2['scores']['preferred'] < d1['scores']['preferred'])
    return -1;
  if (d2['scores']['preferred'] > d1['scores']['preferred'])
    return 1;
  if (d2['scores']['optional'] < d1['scores']['optional'])
    return -1;
  if (d2['scores']['optional'] > d1['scores']['optional'])
    return 1;
  if (d2['recipe']['required'].length < d1['recipe']['required'].length)
    return -1;
  if (d2['recipe']['required'].length > d1['recipe']['required'].length)
    return 1;
  return 0;
}

main();

// var Craddock = {};

// Craddock.ask = function(options, callback) {
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
// };

// module.exports = Craddock;