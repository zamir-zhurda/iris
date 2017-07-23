'use strict';

const request = require('superagent');


 module.exports.process = function process(intentData, registry , callback){
   
    if(intentData.intent[0].value !== 'time'){
             return callback(new Error(`\n Expected time intent got ${intentData.intent[0].value} `));
        }

    if(!intentData.location){
         return callback(new Error(`\nMissing location in time intent!`));
    }
       // return callback(new Error(null,` \n I don't know yet the time in  ${ intentData.location[0].value } ` ));

       const location = intentData.location[0].value;
       
      // console.log('location asked: '+ location);


       const service = registry.get('time');

       if(!service) return callback(false,'No service available');
   
       request.get(`http://${service.ip}:${service.port}/service/${location}`, (errorCallingTheService, responseFromTheService) =>{

             if(errorCallingTheService || responseFromTheService.statusCode != 200 ||  !responseFromTheService.body.result ){
                
                console.log('\nerror from service: ' + errorCallingTheService);
               // console.log('\n\n result: '+  responseFromTheService.body.result);

                return callback(false, `I had a problem finding out time in ${location}`);
             }
             
           

               return callback(false, `In ${location} it is now ${responseFromTheService.body.result}`);
       });
    

 } 