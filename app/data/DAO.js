/**
 * Class to store data about vacancy.
 */
class VacancyStatsData {
    constructor(url, salary, source) {
        this.url = url || "";
        this.technologies = new Technologies();
        this.salary = salary || 0.0;
        this.source = source || {};
    }
}

/**
 * Dictionary of vacancies` technologies.
 */
class Technologies {
    constructor(dict) {
        let techs = dict || {};
        this.hasAngular = techs.angular || false;
        this.hasReact = techs.react || false;
        this.hasEmber = techs.ember || false;
        this.hasJQuery = techs.jquery || false;
    }

    select(dict) {
        this.hasAngular = dict.angular || this.hasAngular;
        this.hasReact = dict.react || this.hasReact;
        this.hasEmber = dict.ember || this.hasEmber;
        this.hasJQuery = dict.jquery || this.hasJQuery;
    }
}

module.exports =  {
    VacancyStatsData,
    Technologies
}