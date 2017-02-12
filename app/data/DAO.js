/**
 * Class to store data about vacancy.
 */
class VacancyStatsData {
    constructor(url, technologies, source) {
        this.url = url || "";
        this.technologies = technologies || new Technologies();
        this.source = source || {};
    }
}

/**
 * Dictionary of vacancies` technologies.
 */
class Technologies {
    constructor(dict) {
        let techs = dict || {};
        this.hasAngular = techs.Angular || false;
        this.hasReact = techs.React || false;
        this.hasEmber = techs.Ember || false;
        this.hasJQuery = techs.JQuery || false;
    }
}

module.exports =  {
    VacancyStatsData,
    Technologies
}