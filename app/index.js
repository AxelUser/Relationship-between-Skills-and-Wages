'use strict'

const getData = require('./lib/getData');
const createTrainingSet = require('./lib/createTrainingSet');

(new Promise((res, rej) => getData(res)))
    .then(() => new Promise((res, rej) => createTrainingSet(res)));