/**
 * Examples:
 *  User: 'Alexa, ask Harry what cocktail I should make with rye and Peychaud's bitters.'
 *  Alexa: 'Since it's a chilly day, I suggest a sazerac.'
 *  User: 'How do I make that?'
 *  Alexa: describes recipe
 *  User: 'I'm not sure I want that.'
 *  Alexa: 'Perhaps you would prefer an old-fashioned?'
 */

var _          = require('lodash');
var AlexaSkill = require('./lib/alexa-skill');
var Craddock   = require('./lib/craddock');

var APP_ID = 'amzn1.echo-sdk-ams.app.7667a91f-38e7-4e91-84a3-bc1b286c20a8';

var Harry = function () {
    AlexaSkill.call(this, APP_ID);
};

Harry.prototype = Object.create(AlexaSkill.prototype);
Harry.prototype.constructor = Harry;
Harry.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log('Harry onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);
    handleNewSuggestion();
};

Harry.prototype.intentHandlers = {
    'GetSuggestionIntent': function (intent, session, response) {
        handleNewSuggestion(intent, response, session);
    },

    'TryAgainIntent': function (intent, session, response) {
        handleTryAgain(intent, response, session);
    },

    'RecipeIntent': function (intent, session, response) {
        handleRecipe(intent, response, session);
    },

    'AMAZON.HelpIntent': function (intent, session, response) {
        response.ask('You can tell Harry what ingredients you have, or, you can say exit... What can I help you with?', 'What can I help you with?');
    },

    'AMAZON.StopIntent': function (intent, session, response) {
        var speechOutput = 'Cheers';
        response.tell(speechOutput);
    },

    'AMAZON.CancelIntent': function (intent, session, response) {
        var speechOutput = 'Cheers';
        response.tell(speechOutput);
    },

    'AMAZON.StartOverIntent': function (intent, session, response) {
        var speechOutput = 'Cheers';
        response.tell(speechOutput);
    },

    'AMAZON.RepeatIntent': function (intent, session, response) {
        var speechOutput = 'Cheers';
        response.tell(speechOutput);
    }
};

function handleNewSuggestion(intent, response, session) {
    var speechText = '';
    var ingredients = _.compact(_.map(intent.slots, function(n) {
        return n.value;
    }));

    session.attributes.stage = 0;
    session.attributes.suggestions = null;
    session.attributes.currentCocktail = null

    if(ingredients.length) {
        Craddock.ask({ ingredients: ingredients }).then(function(res) {
            session.attributes.stage = 1;
            session.attributes.suggestions = res;
            session.attributes.currentCocktail = 0;
            speechText = formatSuggestion(res[0]);
            response.tellWithCard(speechText, 'Harry', speechText, false);
        }).catch(function(err) {
            speechText = "I'm sorry, I couldn't find anything appropriate.";
            response.tellWithCard(speechText, 'Harry', speechText, false);
        });
    } else {
        speechText = 'What ingredients do you have available?';
        response.tellWithCard(speechText, 'Harry', speechText, false);
    }
}

function handleTryAgain(intent, response, session) {
    var speechText = '';
    
    if(session.attributes.stage === 1) {
        var current = session.attributes.currentCocktail;
        var next = current + 1;

        console.log("next: " + next)
        if(session.attributes.suggestions && session.attributes.suggestions[next]) {
            console.log(session.attributes.suggestions[next])
            session.attributes.currentCocktail = next;
            speechText = formatTryAgain(session.attributes.suggestions[next]);
        } else {
            speechText = "I'm sorry, those are all my suggestions. Please ask me again when you have different ingredients.";
        }   
    } else {
        speechText = "What ingredients do you have?";
    }

    response.tellWithCard(speechText, 'Harry', speechText, false);
}

function handleRecipe(intent, response, session) {
    var speechText = "I'm sorry, I'm not sure what is in that.";
    response.tellWithCard(speechText, 'Harry', speechText, false);
}

function formatSuggestion(cocktail) {
   return 'I suggest a ' + cocktail.name;
}

function formatTryAgain(cocktail) {
   return 'Perhaps you would prefer a ' + cocktail.name;
}


function formatRecipe(cocktail) {

}

exports.handler = function (event, context) {
    var harry = new Harry();
    harry.execute(event, context);
};
