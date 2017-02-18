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

function loadPageAsync(hostname, path) {
    let options = {
        hostname,
        path,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise((resolve, reject) => {
        let cb = response => {
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
                    LogProgress("HTTP", `Received page for ${hostname.concat(path)}`);
                    resolve(JSON.parse(body));
                });
        };

        https.get(options, cb)
            .on('error', (e) => {
                LogProgress("HTTP", e.message);
            });
    });
}

async function loadAllPagesAsync(hostname, path) {
    let pageData = null;
    let pathForPage = path;
    const loadedPages = [];
    try {
        pageData = await loadPageAsync(hostname, path);
        loadedPages.push(pageData);
    } catch (e) {
        //TODO handle errors.
        throw e;
    }

    while (+pageData.page < pageData.pages - 1) {
        try {
            pathForPage = urlBuilder(path, {
                query: {
                    page: pageData.page + 1
                }
            });
            pageData = await loadPageAsync(hostname, pathForPage);
            loadedPages.push(pageData);
        } catch (e) {
            //TODO handle errors.
            throw e;
        }
    }
    return loadedPages;
}

async function loadDataAsync(hostname, path, alias) {
    let dataPages = [];
    try {
        dataPages = await loadAllPagesAsync(hostname, path);
    } catch (e) {
        throw [];
    }

    const vacancies = [];

    dataPages.forEach(dataPage => {
        if (dataPage.items) {
            dataPage.items.forEach(vacancy => {
                if (!vacancies.some(data => data.id === vacancy.id)) {
                    vacancies.push(vacancy);
                }
            });
        }
    });
    return {
        alias,
        vacancies
    }
}

function getData(callback) {
    const dataLinks = getLinks();

    const promises = dataLinks.map((link) => {
        return loadDataAsync(link.host, link.path, link.alias);
    });

    Promise.all(promises).then((contents) => {
        CleanData();
        LogProgress("FILE", `Data was deleted.`);
        contents.forEach(({alias, vacancies}) => {
            let info = {
                alias,
                count: vacancies.length,
                vacancies  
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