'use strict';

const NN_PATH = './data/nn_model.json';
const NN_MANIFEST = './data/nn_manifest.json';
const NN_LOG = './data/nn_log.json';
const NN_RUN_OUTPUT = './data/nn_run.csv';
const MAX_SALARY = 1000000;

const fs = require('fs');
const synaptic = require('synaptic');
const combinatorics = require('js-combinatorics');

function runNN(resolve, reject) {
    let jsonModel = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));
    let nn = synaptic.Network.fromJSON(jsonModel);

    

    let file = fs.createWriteStream(NN_RUN_OUTPUT);
    console.log('Run started');
    combinatorics.baseN([0, 1], 18).forEach(input => {        
        let inputString = input.join();
        let res = nn.activate(input);
        let outputString = res.map(salary => salary * MAX_SALARY).join();
        file.write(`${inputString},${outputString}\n`);        
    });
    file.end();
    console.log('File saved');
    resolve();
}

module.exports = () => new Promise(runNN);

