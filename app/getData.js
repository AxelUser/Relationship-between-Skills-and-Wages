'use strict'

const API_LINKS_PATH = './data/api_links.json';
const VACANCIES_PATH = './data/vacancies';

const fs = require('fs');
const https = require('https');
const pathModule = require('path');

function LogProgress(title, message) {
    console.log(`${title}: ${message}`);
}

function CleanData() {
    let jsonFiles = fs.readdirSync(VACANCIES_PATH);
    jsonFiles.forEach((file) => fs.unlinkSync(pathModule.join(VACANCIES_PATH, file)));
}

function CreateRequestPromise(host, path, alias) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname : host,
            path,
            headers: {
                'User-Agent': 'request'
            }
        };
        let cb = function(response) {
            let body = [];

            if(response.statusCode !== 200) {
                LogProgress("HTTP", `Request failed (${response.statusCode})`);
                reject(response.statusCode);
            }

            response.on('data', (chunk) => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                LogProgress("HTTP", `Received ${alias}`);
                resolve({
                    alias,
                    body
                });
            });
        };
        https.get(options, cb)
            .on('error', (e) => {
                LogProgress("HTTP", e.message);
            });
    });
}

const dataLinks = JSON.parse(fs.readFileSync(API_LINKS_PATH, 'utf8'));

const promises = dataLinks.map((link) => {
    return CreateRequestPromise(link.host, link.path, link.alias);
});

Promise.all(promises).then((contents) => {
    CleanData();
    LogProgress("FILE", `Data was deleted.`);
    contents.forEach(({alias, body}) => {
        let info = {
            alias,
            data: JSON.parse(body)
        }
        fs.writeFileSync(pathModule.join(VACANCIES_PATH, `/${alias}.json`), JSON.stringify(info));
        LogProgress("FILE", `Saved ${alias}.json`);
    });
});