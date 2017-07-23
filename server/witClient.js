'use strict';

const request = require('superagent');

function handleWitResponse(response)
{
 // console.log(response);
   return response.entities ;
}

module.exports = function witClient (token){
    const ask = function ask(message , callbackAfterAsking){

       // console.log('ask: '+message);
       // console.log('token: '+token);

        request.get('https://api.wit.ai/message')
            .set('Authorization', 'Bearer ' + token)
            .query({v : '16/07/2017'})
            .query({q : message})
            .end((errorFromResponse, response) => {
              
                if (errorFromResponse)
                {  
                    return callbackAfterAsking(errorFromResponse);
                }
                if (response.status != 200)
                {
                    return callbackAfterAsking('Expected status 200 but got ' + errorFromResponse.status);
                }

                const witResponse = handleWitResponse(response.body);
                
                return callbackAfterAsking(null, witResponse );
            })

    }

    return {
        ask : ask
    }
}