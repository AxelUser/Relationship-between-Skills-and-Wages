'use strict'

if(process.argv.indexOf('-s') >= 0){
    const getData = require('./lib/getData');
    const createTrainingSet = require('./lib/createTrainingSet');

    (new Promise((res, rej) => getData(res)))
    .then(() => new Promise((res, rej) => createTrainingSet(res)));
}

if(process.argv.indexOf('-t') >= 0) {
    const trainNN = require('./lib/trainNN');
    
    trainNN();
}