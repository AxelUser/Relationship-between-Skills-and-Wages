'use strict'

const TRAINING_SET_FILE_PATH = './data/trainingSet.json';
const NN_PATH = './data/nn_model.json';
const MAX_SALARY = 1000000;

const fs = require('fs');
const synaptic = require('synaptic');

function getNormalizedTrainingSet() {
    let trainingSet = JSON.parse(fs.readFileSync(TRAINING_SET_FILE_PATH, 'utf8'));
    return trainingSet.map((example) => {
        let nSalary = example.salary <= MAX_SALARY? example.salary / MAX_SALARY: 1;
        let nTechs = [
            +example.angular,
            +example.react,
            +example.ember,
            +example.jquery
        ]
        return {
            input: nTechs,
            output: [nSalary]
        }
    })
}

function TrainNN(callback){
    let nn = new synaptic.Architect.Perceptron(4, 4, 1);
    let trainer = new synaptic.Trainer(nn);
    let trainingOptions = {
        rate: .0001,
        iterations: 50000,
        error: .005,
        shuffle: true,
        log: 1000,
        cost: synaptic.Trainer.cost.CROSS_ENTROPY
    }

    let trainingSet = getNormalizedTrainingSet();

    let trainResults = trainer.train(trainingSet, trainingOptions);
    console.log(trainResults);

    let nnJSON = nn.toJSON();
    fs.writeFileSync(NN_PATH, JSON.stringify(nnJSON));

    if(callback !== undefined) {
        callback();
    }
}

module.exports = TrainNN;