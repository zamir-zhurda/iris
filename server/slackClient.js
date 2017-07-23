'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let rtmClient = null;
let nlpClient = null;
let registry = null;
function handleOnAuthenticated(rtmStartData) {

    console.log(`\n Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name } but not yet connected to a channel `);

}

function handleOnMessage(message) {
    //console.log(message);

    if (message.text.toLowerCase().includes('iris')) {

        nlpClient.ask(message.text, (errorFromAsking, result) => {
            if (errorFromAsking) {
                console.log(errorFromAsking);
                return;
            }

            try {
                
              if (!result.intent || !result.intent[0] || !result.intent[0].value)
                {
                    throw new Error ("Could not extract intent");
                }

                const intent = require('./intent/'+ result.intent[0].value + 'Intent');


                 intent.process(result, registry, function(error, response){

                    if(error)
                     {
                         console.debug(error.message);
                         return;
                     }
                        return rtmClient.sendMessage(response, message.channel);
                 });

  
            } catch (error) {
                  console.log('\n error trying: ' + error);
                  console.log('\n result: ' + JSON.stringify(result));
                  
                  rtmClient.sendMessage("Sorry, I don't know what you are talking about!", message.channel);
            }

            // if (!result.intent) {

            //     rtmClient.sendMessage('Sorry, I dont know what you are talking about!', message.channel);

            // } else if (result.intent[0].value == 'time' && result.location) {

            //     rtmClient.sendMessage(` I don't know yet the time in ${result.location[0].value}`, message.channel);

            // } else {

            //     rtmClient.sendMessage(`Sorry, I dont know what you are talking about! `, message.channel);

            // }

        });

    }

}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(token, logLevel, naturalLanguageProcessingClient, serviceRegistry) {
    rtmClient = new RtmClient(token, {
        logLevel: logLevel
    });
    nlpClient = naturalLanguageProcessingClient;
    registry = serviceRegistry;
    addAuthenticatedHandler(rtmClient, handleOnAuthenticated);
    rtmClient.on(RTM_EVENTS.MESSAGE, handleOnMessage);

    return rtmClient;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;