'use strict'

if(process.argv.indexOf('-s') >= 0){
    const getData = require('./scripts/getData');
    const createTrainingSet = require('./scripts/createTrainingSet');

    (new Promise((res, rej) => getData(res)))
    .then(() => new Promise((res, rej) => createTrainingSet(res)))
} else {
    const trainNN = require('./scripts/trainNN');
    trainNN();
}