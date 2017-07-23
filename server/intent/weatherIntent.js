'use strict';

const request = require('superagent');


 module.exports.process = function process(intentData, registry , callback){
   
    if(intentData.intent[0].value !== 'weather'){
             return callback(new Error(`\n Expected weather intent got ${intentData.intent[0].value} `));
        }
   
    if(!intentData.location){
         return callback(new Error(`\nMissing location in weather intent!`));
    }
       // return callback(new Error(null,` \n I don't know yet the time in  ${ intentData.location[0].value } ` ));

       const location = intentData.location[0].value;
       
      // console.log('location asked: '+ location);


       const service = registry.get('weather');

       if(!service) return callback(false,'No service available');

       request.get(`http://${service.ip}:${service.port}/service/${location}`, (errorCallingTheService, responseFromTheService) =>{

             if(errorCallingTheService || responseFromTheService.statusCode != 200 ||  !responseFromTheService.body.result ){
                
                console.log('\n Error from service: ' + errorCallingTheService);
               // console.log('\n\n result: '+  responseFromTheService.body.result);

                return callback(false, `I had a problem finding out time in ${location}`);
             }
             
           

               return callback(false, `The current weather in ${location} is ${responseFromTheService.body.result}`);
       });
    

 } 