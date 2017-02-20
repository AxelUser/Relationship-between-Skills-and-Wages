'use strict'

const rurToEur = 62.68;
const rurToUsd = 58.85;
const VACANCIES_PATH = './data/vacancies';
const TRAINING_SET_FILE_PATH = './data/training_set.json';

const fs = require('fs');
const pathModule = require('path');
const vacanciesDAO = require('./DAO');

const jsonRegEx = /\.json$/g;

function convertCurrency(amount, currency) {
    switch (currency.toUpperCase()) {
        case "RUR":
            return amount;
            break;
        case "EUR":
            return amount * rurToEur;
            break;
        case "USD":
            return amount * rurToUsd;
            break;
        default: return -1;
    }
}

function parseVaсancy(vacancySource) {
    if (vacancySource.salary === undefined
        || (vacancySource.salary.from === null && vacancySource.salary.to === null)) {
        throw "No salary found."
    }
    let wage = vacancySource.salary;
    let salaryFrom = wage.from === null || wage.from === 0 ? wage.to : wage.from;
    let salaryTo = wage.to === null || wage.to === 0 ? wage.from : wage.to;
    salaryFrom = convertCurrency(salaryFrom, vacancySource.salary.currency)
    salaryTo = convertCurrency(salaryTo, vacancySource.salary.currency)

    let url = vacancySource.alternate_url;

    let id = vacancySource.id;

    return new vacanciesDAO.VacancyStatsData(id, url, salaryFrom, salaryTo, vacancySource);
}

function handleFileParsing(sourceJSON, vacanciesList) {
    let items = sourceJSON.vacancies;
    let counter = 0;
    items.forEach((item) => {
        try {
            let vacancy = parseVaсancy(item);
            let selection = {};
            selection[sourceJSON.alias] = true;
            let foundDublicate = vacanciesList.find((v) => v.url === vacancy.url);
            if (foundDublicate !== undefined) {
                logProgress(`${sourceJSON.alias}`, `Dublicate of ${vacancy.url}`);
                foundDublicate.technologies.select(selection);
            } else {
                vacancy.technologies.select(selection);
                vacanciesList.push(vacancy);
                counter++;
            }
        } catch (error) {
            logProgress(`ERROR ${sourceJSON.alias}`, error);
        }
    });
    logProgress(`${sourceJSON.alias}`, `New items: ${counter}`);
}

function getMaxSalaries(vacanciesList) {
    let maxSalaryFrom = 0;
    let maxSalaryTo = 0;

    vacanciesList.forEach(vacancy => {
        if (vacancy.salaryFrom > maxSalaryFrom) {
            maxSalaryFrom = vacancy.salaryFrom;
        }
        if (vacancy.salaryTo > maxSalaryTo) {
            maxSalaryTo = vacancy.salaryTo;
        }
    });

    return {
        maxSalaryFrom,
        maxSalaryTo
    }
}

function getTrainingSet(vacanciesList) {
    return vacanciesList.map((vacancy) => {
        return {
            salaryFrom: vacancy.salaryFrom,
            salaryTo: vacancy.salaryTo,
            technologies: vacancy.technologies.toJSON(),
            technologies_vector: vacancy.technologies.toVec()
        };
    });
}

function logProgress(title, message) {
    console.log(`${title}: ${message}`);
}

function createTrainingSet(resolve, reject) {
    let filenames = fs.readdirSync(VACANCIES_PATH);
    const vacanciesList = [];
    filenames.forEach((jsonFile) => {
        if (jsonRegEx.test(jsonFile)) {
            let data = JSON.parse(fs.readFileSync(pathModule.join(VACANCIES_PATH, jsonFile), 'utf8'));
            handleFileParsing(data, vacanciesList);
        }
    });
    let trainingSet = getTrainingSet(vacanciesList);
    let {maxSalaryFrom, maxSalaryTo} = getMaxSalaries(vacanciesList);
    let trainingSetFile = {
        count: trainingSet.length,
        maxSalaryFrom,
        maxSalaryTo,
        set: trainingSet
    }
    fs.writeFileSync(TRAINING_SET_FILE_PATH, JSON.stringify(trainingSetFile));
    resolve();
}

module.exports = () => new Promise((res, rej) => createTrainingSet(res, rej));