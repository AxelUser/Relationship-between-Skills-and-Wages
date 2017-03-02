'use strict';

const TRAINING_SET_FILE_PATH = './data/training_set.json';
const NN_PATH = './data/nn_model.json';
const NN_MANIFEST = './data/nn_manifest.json';
const NN_LOG = './data/nn_log.json';
const MAX_SALARY = 1000000;

const fs = require('fs');
const synaptic = require('synaptic');

/**
 * Gaussian normalization
 * 
 * @param {[]} salaries
 */
function normalizeSalaries(salaries) {
    let meanSalary = salaries.reduce((prev, curr) => prev + curr) / salaries.length;
    let stdDer = Math.sqrt(salaries.reduce((prev, curr) => prev + Math.pow(curr - meanSalary, 2), 0) / salaries.length);

    return salaries.map(salary => {
        return (salary - meanSalary) / stdDer;
    });
}

/**
 * 
 * @return {[]}
 */
function getNormalizedTrainingSet() {
    let trainingSet = JSON.parse(fs.readFileSync(TRAINING_SET_FILE_PATH, 'utf8')).set

    return trainingSet.map(example => {
        let nTechs = example.technologies_vector;
        let nSalaryFrom = example.salaryFrom <= MAX_SALARY? example.salaryFrom / MAX_SALARY: 1;
        let nSalaryTo = example.nSalaryTo <= MAX_SALARY? example.nSalaryTo / MAX_SALARY: 1;
        return {
            input: nTechs,
            output: [nSalaryFrom, nSalaryTo]
        }
    });
}

function createNN(inCount, hiddedCount, outCount) {
    let inputLayer = new synaptic.Layer(inCount);
    let hiddenLayer = new synaptic.Layer(hiddedCount);
    let outputLayer = new synaptic.Layer(outCount);

    inputLayer.set({
        squash: synaptic.Neuron.squash.LOGISTIC
    })
    hiddenLayer.set({
        squash: synaptic.Neuron.squash.LOGISTIC
    })
    outputLayer.set({
        squash: synaptic.Neuron.squash.IDENTITY
    })

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    let net = new synaptic.Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    })

    net = new synaptic.Architect.Perceptron(18, 10, 2);

    return net;
}

function createTrainingChart(nnLogs) {

}

function trainNN(callback) {
    let trainingLog = [];
    let nn = createNN(18, 3, 2)
    let trainer = new synaptic.Trainer(nn);
    let trainingOptions = {
        rate: .0001,
        iterations: 50000,
        error: .0015,
        shuffle: true,
        log: 1000,
        cost: synaptic.Trainer.cost.MSE,
        schedule: {
            every: 1,
            do: data => {
                trainingLog.push(data)
                if (Math.round(trainingLog.length % 500) === 0) {
                    console.log(data);
                }
            }
        }
    }
    let allExamples = getNormalizedTrainingSet();
    let countTrain = Math.round(allExamples.length * 0.7);
    let trainingSet = allExamples.slice(0, countTrain - 1);
    let testingSet = allExamples.slice(countTrain, allExamples.length - 1);
    let trainResults = trainer.train(trainingSet, trainingOptions);
    let testResults = trainer.test(testingSet, trainingOptions);
    fs.writeFileSync(NN_MANIFEST, JSON.stringify({
        train: trainResults,
        test: testResults
    }));
    fs.writeFileSync(NN_LOG, JSON.stringify(trainingLog));
    console.log(trainResults);
    console.log(testResults);

    let nnJSON = nn.toJSON();
    fs.writeFileSync(NN_PATH, JSON.stringify(nnJSON));

    if (callback !== undefined) {
        callback();
    }
}

module.exports = trainNN;