'use strict'

function buildUrl(base = "", options = {}) {
    let url = base;

    if (options.pathname) {
        url = url.concat(options.pathname)
    }

    if (options.query) {
        let queryArray = [];
        for (let q in options.query) {
            if (options.query.hasOwnProperty(q)) {
                queryArray.push(`${q}=${options.query[q]}`);                
            }
        }
        if(!url.includes("?")) {
            url = url.concat("?");
        }
        url = url.concat("&", queryArray.join('&'));
    }
    return url;
}

module.exports = buildUrl;