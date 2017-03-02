'use strict'

/**
 * Class to store data about vacancy.
 */
class VacancyStatsData {
    /**
     * 
     * @param {string} id
     * @param {string} url
     * @param {number} salaryFrom
     * @param {number} salaryTo 
     * @param {*} source 
     */
    constructor(id, url = "", salaryFrom = 0.0, salaryTo = 0.0, source = {}) {
        this.id = id;
        this.url = url;
        this.technologies = new Technologies();
        this.salaryFrom = salaryFrom;
        this.salaryTo = salaryTo;
        this.source = source;
    }
}

/**
 * Dictionary of vacancies` technologies.
 */
class Technologies {
    constructor(dict) {
        let techs = dict || {};
        this.hasPHP = techs.php || false;
        this.hasLaravel = techs.php_laravel || false;
        this.hasSymfony = techs.php_symfony || false;
        this.hasNodeJs = techs.nodejs || false;
        this.hasExpressJs = techs.nodejs_expressjs || false;
        this.hasPython = techs.python || false;
        this.hasDjango = techs.python_django || false;
        this.hasJava = techs.java || false;
        this.hasAndroid = techs.java_android || false;
        this.hasCSharp = techs.csharp || false;
        this.hasAspNet = techs.csharp_asp || false;
        this.hasMySql = techs.db_mysql || false;
        this.hasPostgres = techs.db_postgres || false;
        this.hasJavascript = techs.javascript || false;
        this.hasAngular = techs.javascript_angular || false;
        this.hasReact = techs.javascript_react || false;
        this.hasEmber = techs.javascript_ember || false;
        this.hasJQuery = techs.javascript_jquery || false;
    }

    select(techs) {
        this.hasPHP = techs.php || this.hasPHP;
        this.hasLaravel = techs.php_laravel || this.hasLaravel;
        this.hasSymfony = techs.php_symfony || this.hasSymfony;
        this.hasNodeJs = techs.nodejs || this.hasNodeJs;
        this.hasExpressJs = techs.nodejs_expressjs || this.hasExpressJs;
        this.hasPython = techs.python || this.hasPython;
        this.hasDjango = techs.python_django || this.hasDjango;
        this.hasJava = techs.java || this.hasJava;
        this.hasAndroid = techs.java_android || this.hasAndroid;
        this.hasCSharp = techs.csharp || this.hasCSharp;
        this.hasAspNet = techs.csharp_asp || this.hasAspNet;
        this.hasMySql = techs.db_mysql || this.hasMySql;
        this.hasPostgres = techs.db_postgres || this.hasPostgres;
        this.hasJavascript = techs.javascript || this.hasJavascript;
        this.hasAngular = techs.javascript_angular || this.hasAngular;
        this.hasReact = techs.javascript_react || this.hasReact;
        this.hasEmber = techs.javascript_ember || this.hasEmber;
        this.hasJQuery = techs.javascript_jquery || this.hasJQuery;
    }

    toJSON() {
        return {
            php: this.hasPHP,
            laravel: this.hasLaravel,
            symfony: this.hasSymfony,
            nodejs: this.hasNodeJs,
            expressjs: this.hasExpressJs,
            python: this.hasPython,
            django: this.hasDjango,
            java: this.hasJava,
            android: this.hasAndroid,
            csharp: this.hasCSharp,
            aspnet: this.hasAspNet,
            mysql: this.hasMySql,
            postgres: this.hasPostgres,
            javascript: this.hasJavascript,
            angular: this.hasAngular,
            react: this.hasReact,
            ember: this.hasEmber,
            jquery: this.hasJQuery
        }
    }

    toVec() {
        return [
            +this.hasPHP,
            +this.hasLaravel,
            +this.hasSymfony,
            +this.hasNodeJs,
            +this.hasExpressJs,
            +this.hasPython,
            +this.hasDjango,
            +this.hasJava,
            +this.hasAndroid,
            +this.hasCSharp,
            +this.hasAspNet,
            +this.hasMySql,
            +this.hasPostgres,
            +this.hasJavascript,
            +this.hasAngular,
            +this.hasReact,
            +this.hasEmber,
            +this.hasJQuery
        ]
    }

    static jsonToVec(techJSON) {
        let vec = [
            +techJSON.php,
            +techJSON.laravel,
            +techJSON.symfony,
            +techJSON.nodejs,
            +techJSON.expressjs,
            +techJSON.python,
            +techJSON.django,
            +techJSON.java,
            +techJSON.android,
            +techJSON.csharp,
            +techJSON.aspnet,
            +techJSON.mysql,
            +techJSON.postgres,
            +techJSON.javascript,
            +techJSON.angular,
            +techJSON.react,
            +techJSON.ember,
            +techJSON.jquery
        ]
    }
}

module.exports = {
    VacancyStatsData,
    Technologies
}