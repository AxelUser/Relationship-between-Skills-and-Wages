'use strict'

const API_LINKS = './data/api_links.json';

const fs = require('fs');
const https = require('https');

function LogProgress(title, message) {
    console.log(`${title}: ${message}`);
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

const dataLinks = JSON.parse(fs.readFileSync(API_LINKS, 'utf8'));

const promises = dataLinks.map((link) => {
    return CreateRequestPromise(link.host, link.path, link.alias);
});

Promise.all(promises).then((contents) => {
    contents.forEach(({alias, body}) => {
        let info = {
            alias,
            data: JSON.parse(body)
        }
        fs.writeFileSync(`./data/vacancies/${alias}.json`, JSON.stringify(info));
        LogProgress("HTTP", `Saved ${alias}.json`);
    });
});