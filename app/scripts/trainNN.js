'use strict';

const TRAINING_SET_FILE_PATH = './data/vacancies/training_set.json';
const NN_PATH = './data/model/nn_model.json';
const NN_MANIFEST = './data/model/nn_manifest.json';
const NN_LOG = './data/model/nn_log.json';
const NN_TRAIN_ITERATIONS_FILE = './data/model/nn_train.csv';
const NN_PLAIN_TRAIN = './data/model/final_train_set.csv';
const NN_PLAIN_TEST = './data/model/final_test_set.csv';

const fs = require('fs');
const synaptic = require('synaptic');

/**
 * Gaussian normalization
 * 
 * @param {[]} salaries
 */
function normalizeSalariesGaussian(salaries) {
    let meanSalary = salaries.reduce((prev, curr) => prev + curr) / salaries.length;
    let stdDer = Math.sqrt(salaries.reduce((prev, curr) => prev + Math.pow(curr - meanSalary, 2), 0) / salaries.length);

    return salaries.map(salary => {
        return (salary - meanSalary) / stdDer;
    });
}

function zeroCenterValue(value, meanValue, maxValue) {
    return value / maxValue; //(value - meanValue) / maxValue;
}

/**
 * Center values around zero.
 * @param {number} maxValue 
 * @param {number} meanValue 
 * @param {[]} values 
 */
function zeroCenterValues(values, meanValue, maxValue) {
    return values.map(value => zeroCenterValue(value, meanValue, maxValue));
}


/**
 * Get random integer.
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {[]} examples 
 * @param {number} trainCount 
 */
function divideSet(examples, trainCount) {
    const testingSet = examples.slice();
    const trainingSet = [];
    let index = 0;
    while (trainingSet.length < trainCount) {
        index = getRandomInt(0, testingSet.length);
        trainingSet.push(testingSet.splice(index, 1)[0]);
    }
    return {
        trainingSet,
        testingSet
    }
}

/**
 * 
 * @return {[]}
 */
function getNormalizedTrainingSet(dataFile) {
    let trainingSet = dataFile.set;

    return trainingSet.map(ex => {
        let nTechs = ex.technologies_vector;
        let nSalaryFrom = zeroCenterValue(ex.salaryFrom, dataFile.meanSalaryFrom, dataFile.maxSalaryFrom);
        let nSalaryTo = zeroCenterValue(ex.salaryTo, dataFile.meanSalaryTo, dataFile.maxSalaryTo);
        return {
            input: nTechs,
            output: [nSalaryFrom, nSalaryTo]
        }
    });
}

function getTrainingOptions(trainingLog) {
    return {
        rate: .0001,
        iterations: 50000,
        error: .0041,
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
        squash: synaptic.Neuron.squash.LOGISTIC
    })

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    let net = new synaptic.Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    })

    return net;
}

function trainNN(callback) {
    let dataFile = JSON.parse(fs.readFileSync(TRAINING_SET_FILE_PATH, 'utf8'));

    let trainingLog = [];
    let nn = createNN(18, 3, 2);
    let trainer = new synaptic.Trainer(nn);
    let trainingOptions = getTrainingOptions(trainingLog);
    let allExamples = getNormalizedTrainingSet(dataFile);
    let countTrain = Math.round(allExamples.length * 0.7);
    let { trainingSet, testingSet } = divideSet(allExamples, countTrain);
    let trainResults = trainer.train(trainingSet, trainingOptions);
    let testResults = trainer.test(testingSet, trainingOptions);
    fs.writeFileSync(NN_MANIFEST, JSON.stringify({
        train: trainResults,
        test: testResults
    }));

    fs.writeFileSync(NN_LOG, JSON.stringify(trainingLog));
    fs.writeFileSync(NN_TRAIN_ITERATIONS_FILE, trainingLog.map(iteration => `${iteration.iterations}\t${iteration.error}`).join('\n'));
    fs.writeFileSync(NN_PLAIN_TRAIN, trainingSet.map(set => {
        let vec = set.input.concat(set.output);
        return vec.join('\t');
    }).join('\n'));
    fs.writeFileSync(NN_PLAIN_TEST, testingSet.map(set => {
        let vec = set.input.concat(set.output);
        return vec.join('\t');
    }).join('\n'));
    console.log(trainResults);
    console.log(testResults);

    let nnJSON = nn.toJSON();
    fs.writeFileSync(NN_PATH, JSON.stringify({
        stats: {
            maxSalaryFrom: dataFile.maxSalaryFrom,
            meanSalaryFrom: dataFile.meanSalaryFrom,
            maxSalaryTo: dataFile.maxSalaryTo,
            meanSalaryTo: dataFile.meanSalaryTo
        },
        model: nnJSON
    }));

    if (callback !== undefined) {
        callback();
    }
}

module.exports = trainNN;