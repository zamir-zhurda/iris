'use strict'; //tells nodejs to use ES6 javascript 

const express = require('express');
const service =  express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new  ServiceRegistry();

service.set('serviceRegistry',serviceRegistry); // I am setting a serviceRegistry Property on the express() to get it later

//adding service registry 

service.put('/service/:intent/:port', (request, response, next)=>{

    const serviceIntent = request.params.intent;
    const servicePort = request.params.port;

    //checking if remote ip is ipv6 or not this ('::') means it is IPV6
    const serviceIp = request.connection.remoteAddress.includes('::') ? `[${request.connection.remoteAddress}]` : request.connection.remoteAddress ; 
    
    serviceRegistry.add(serviceIntent,serviceIp,servicePort);

    response.json({result : `${serviceIntent} at ${serviceIp}:${servicePort}`});
});

//to export this application object
module.exports = service;