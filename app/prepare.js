'use strict'

;(function() {
    if(process.argv.includes('-s')){
        const getData = require('./scripts/getData');
        const createTrainingSet = require('./scripts/createTrainingSet');
        getData()
            .then(() => createTrainingSet())
    } else {
        const trainNN = require('./scripts/trainNN');
        trainNN();
    }
})();