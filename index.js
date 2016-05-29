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
    handleNewFactRequest(response);
};

Harry.prototype.intentHandlers = {
    'GetSuggestionIntent': function (intent, session, response) {
        handleNewSuggestionRequest(intent, response);
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

function handleNewSuggestionRequest(intent, response) {
    var ingredients = _.compact(_.map(intent.slots, function(n) {
        return n.value;
    }));

    Craddock.ask({
        ingredients: ingredients,
        limit: '4',
        season: 'summer'
    }, function(err, res) {
        console.log(err)
        console.log(res)
        var responseText = 'I suggest a gimlet.';
        response.tellWithCard(responseText, 'Harry', responseText);
    });
}

exports.handler = function (event, context) {
    var harry = new Harry();
    harry.execute(event, context);
};
