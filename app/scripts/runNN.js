'use strict';

const NN_PATH = './data/nn_model.json';
const NN_MANIFEST_FILE = './data/nn_manifest.json';
const NN_LOG_FILE = './data/nn_log.json';
const NN_RUN_FILE = './data/nn_run.csv';
const NN_INPUT_IMPORTANCE_FILE = './data/nn_input_importance.csv'
const MAX_SALARY = 1000000;
const inputsCount = 18;
const inputsValues = [0, 1];

const fs = require('fs');
const synaptic = require('synaptic');
const combinatorics = require('js-combinatorics');

function runCombinations(nn) {
    console.log('Run started');
    let file = fs.createWriteStream(NN_RUN_FILE);
    combinatorics.baseN(inputsValues, inputsCount).forEach(input => {
        let inputString = input.join('\t');
        let res = nn.activate(input);
        let outputString = res.map(salary => salary * MAX_SALARY).join('\t');
        file.write(`${inputString}\t${outputString}\n`, 'utf8');
    });
    file.end();
    console.log('Run finished');
}

function runAnalysis(nn) {
    console.log('Input`s analysis started');
    let file = fs.createWriteStream(NN_INPUT_IMPORTANCE_FILE);
    for (let i = 0; i < inputsCount; i++) {
        let inputVector = Array.from('0'.repeat(inputsCount), str => +str);
        let exampleValues = nn.activate(inputVector);
        let newValues = inputsValues.map(value => {
            inputVector[i] = value;
            return nn.activate(inputVector);
        });
        let maxDeltaSalaryFrom = 0;
        let maxDeltaSalaryTo = 0;
        newValues.forEach((pair => {
            let deltaSalaryFrom = Math.abs(pair[0] - exampleValues[0]);
            let deltaSalaryTo = Math.abs(pair[1] - exampleValues[1]);
            if (maxDeltaSalaryFrom < deltaSalaryFrom) {
                maxDeltaSalaryFrom = deltaSalaryFrom;
            }
            if (maxDeltaSalaryTo < deltaSalaryTo) {
                maxDeltaSalaryTo = deltaSalaryTo;
            }
        }));
        maxDeltaSalaryFrom *= MAX_SALARY;
        maxDeltaSalaryTo *= MAX_SALARY;
        file.write(`${i}\t${maxDeltaSalaryFrom.toFixed(5)}\t${maxDeltaSalaryTo.toFixed(5)}\n`, 'utf8')
    }
    file.end();
    console.log('Input`s analysis finished');
}

function runNN(resolve, reject) {
    let jsonModel = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));
    let nn = synaptic.Network.fromJSON(jsonModel);

    runCombinations(nn);

    runAnalysis(nn);

    resolve();
}

module.exports = () => new Promise(runNN);

