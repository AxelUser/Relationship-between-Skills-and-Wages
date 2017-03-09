'use strict';

const NN_PATH = './data/model/nn_model.json';
const NN_MANIFEST_FILE = './data/model/nn_manifest.json';
const NN_LOG_FILE = './data/model/nn_log.json';
const NN_RUN_FILE = './data/model/nn_run.csv';
const NN_INPUT_IMPORTANCE_FILE = './data/model/nn_input_importance.csv'
const inputsCount = 18;
const inputsValues = [0, 1];

const fs = require('fs');
const synaptic = require('synaptic');
const combinatorics = require('js-combinatorics');

function getSourceValue(centeredValue, meanValue, maxValue) {
    let res = centeredValue * maxValue;// + meanValue;
    return res >= 0 ? res : 0;
}

function runCombinations(nn, stats) {
    console.log('Run started');
    let file = fs.createWriteStream(NN_RUN_FILE);
    combinatorics.baseN(inputsValues, inputsCount).forEach(input => {
        let inputString = input.join('\t');
        let res = nn.activate(input);
        let salaryFrom = getSourceValue(res[0], stats.meanSalaryFrom, stats.maxSalaryFrom);
        let salaryTo = getSourceValue(res[1], stats.meanSalaryTo, stats.maxSalaryTo);
        let outputString = `${salaryFrom}\t${salaryTo}`;
        file.write(`${inputString}\t${outputString}\n`, 'utf8');
    });
    file.end();
    console.log('Run finished');
}

function runAnalysis(nn, stats) {
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
        //let deltaSalaryFrom = getSourceValue(maxDeltaSalaryFrom, stats.meanSalaryFrom, stats.maxSalaryFrom);
        //let deltaSalaryTo = getSourceValue(maxDeltaSalaryTo, stats.meanSalaryTo, stats.maxSalaryTo);
        file.write(`${i}\t${maxDeltaSalaryFrom.toFixed(5)}\t${maxDeltaSalaryTo.toFixed(5)}\n`, 'utf8')
    }
    file.end();
    console.log('Input`s analysis finished');
}

function runNN(resolve, reject) {
    let dataFile = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));
    let nn = synaptic.Network.fromJSON(dataFile.model);

    runCombinations(nn, dataFile.stats);

    runAnalysis(nn, dataFile.stats);

    resolve();
}

module.exports = () => new Promise(runNN);

