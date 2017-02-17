'use strict'

const API_LINKS_PATH = './data/api_links.json';
const VACANCIES_PATH = './data/vacancies';

const fs = require('fs');
const https = require('https');
const pathModule = require('path');
const urlBuilder = require('./urlBuilder');

function LogProgress(title, message) {
    console.log(`${title}: ${message}`);
}

function CleanData() {
    let jsonFiles = fs.readdirSync(VACANCIES_PATH);
    jsonFiles.forEach((file) => fs.unlinkSync(pathModule.join(VACANCIES_PATH, file)));
}

function getLinks() {
    const queryConfig = JSON.parse(fs.readFileSync(API_LINKS_PATH, 'utf8'));
    let base = queryConfig.pathname;
    let defParams = queryConfig.defaults;
    const links = [];
    queryConfig.queries.forEach(queryInfo => {
        let queryParams = Object.assign({}, defParams, queryInfo.params);

        let path = urlBuilder(base, {
            query: queryParams
        });

        links.push({
            alias: queryInfo.alias,
            path,
            host: queryConfig.host

        })
    });
    return links;
}

function CreateRequestPromise(host, path, alias) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: host,
            path,
            headers: {
                'User-Agent': 'request'
            }
        };
        let cb = function (response) {
            let body = [];

            if (response.statusCode !== 200) {
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

function getData(callback) {
    const dataLinks = getLinks();

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

        if (callback) {
            callback();
        }
    });
}

module.exports = getData;

getData()