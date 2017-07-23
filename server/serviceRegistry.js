'use strict';

class ServiceRegistry{

    constructor(){
      this._services = [];
      this._timeout = 30;
    }

  add(intent, ip,port ){
      const key = intent+ip+port;
      
      if(!this._services[key]){
  
          this._services[key] = {};
          this._services[key].timestamp = Math.floor(new Date() / 1000);
          this._services[key].ip = ip;
          this._services[key].port = port;
          this._services[key].intent = intent;

          console.log(`\n Added service for intent ${intent} on ${ip}:${port} `);
          this._cleanUp();
          return;
      }
      //cases when service exists in the array   
       this._services[key].timestamp = Math.floor(new Date() / 1000);
        console.log(`\n Updated service for intent ${intent} on ${ip}:${port} `);


  }
    //function for removing a service
    remove(intent,ip, port){
        const key = intent+ip+port;
        delete this._services[key];
    }


    get(intent){
         this._cleanUp();
        for(let key in this._services){

            if(this._services[key].intent == intent)
            {
                return this._services[key];
            }
        }
        return null;
    }

    _cleanUp(){
        const now = Math.floor(new Date() / 1000);

        for(let key in this._services){
            if( this._services[key].timestamp + this._timeout < now){

                console.log(`\n Removed service for intent ${this._services[key].intent } `);
                delete this._services[key];
            }
        }
    }

}

module.exports = ServiceRegistry;