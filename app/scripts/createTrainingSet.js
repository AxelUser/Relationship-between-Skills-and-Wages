'use strict'

const rurToEur = 62.68;
const rurToUsd = 58.85;
const VACANCIES_PATH = './data/vacancies';
const TRAINING_SET_FILE_PATH = './data/trainingSet.json';

const fs = require('fs');
const pathModule = require('path');
const vacanciesDAO = require('./DAO');


function CurrencyConverter(amount, currency) {
    switch(currency.toUpperCase()) {
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

function ParseVaсancy(vacancySource) {
    if(vacancySource.salary === undefined 
        || (vacancySource.salary.from === null && vacancySource.salary.to === null)) {
        throw "No salary found."
    }

    let salary = vacancySource.salary.to || vacancySource.salary.from;
    salary = CurrencyConverter(salary, vacancySource.salary.currency)    
    
    let url = vacancySource.alternate_url;

    return new vacanciesDAO.VacancyStatsData(url, salary, vacancySource);
}

function HandleFileParsing(sourceJSON, vacanciesList) {
    let items = sourceJSON.data.items;
    let counter = 0;
    items.forEach((item) => {
        try {
            let vacancy = ParseVaсancy(item);
            let selection = {};
            selection[sourceJSON.alias] = true;
            let foundDublicate = vacanciesList.find((v) => v.url === vacancy.url);
            if(foundDublicate !== undefined) {
                LogProgress(`${sourceJSON.alias}`, `Dublicate of ${vacancy.url}`);
                foundDublicate.technologies.select(selection);
            } else {
                vacancy.technologies.select(selection);
                vacanciesList.push(vacancy);
                counter++;
            }
        } catch (error) {
            LogProgress(`ERROR ${sourceJSON.alias}`, error);
        }
    });
    LogProgress(`${sourceJSON.alias}`, `New items: ${counter}`);
}

function GetTrainingSet(vacanciesList) {
    return vacanciesList.map((vacancy) => {
        return {
            salary: vacancy.salary,
            angular: vacancy.technologies.hasAngular,
            react: vacancy.technologies.hasReact,
            ember: vacancy.technologies.hasEmber,
            jquery: vacancy.technologies.hasJQuery
        }
    });
}

function LogProgress(title, message) {
    console.log(`${title}: ${message}`);
}

module.exports = (callback) => {
    let filenames = fs.readdirSync(VACANCIES_PATH);
    const vacanciesList = [];
    filenames.forEach((jsonFile) => {
        let data = JSON.parse(fs.readFileSync(pathModule.join(VACANCIES_PATH, jsonFile), 'utf8'));
        HandleFileParsing(data, vacanciesList);
    });
    let trainingSet = GetTrainingSet(vacanciesList);
    fs.writeFileSync(TRAINING_SET_FILE_PATH, JSON.stringify(trainingSet));
    callback();
}