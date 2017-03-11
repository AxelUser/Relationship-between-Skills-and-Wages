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
        this.hasPHP = techs.php || 0;
        this.hasLaravel = techs.php_laravel || 0;
        this.hasSymfony = techs.php_symfony || 0;
        this.hasNodeJs = techs.nodejs || 0;
        this.hasExpressJs = techs.nodejs_expressjs || 0;
        this.hasPython = techs.python || 0;
        this.hasDjango = techs.python_django || 0;
        this.hasJava = techs.java || 0;
        this.hasAndroid = techs.java_android || 0;
        this.hasCSharp = techs.csharp || 0;
        this.hasAspNet = techs.csharp_asp || 0;
        this.hasMySql = techs.db_mysql || 0;
        this.hasPostgres = techs.db_postgres || 0;
        this.hasJavascript = techs.javascript || 0;
        this.hasAngular = techs.javascript_angular || 0;
        this.hasReact = techs.javascript_react || 0;
        this.hasEmber = techs.javascript_ember || 0;
        this.hasJQuery = techs.javascript_jquery || 0;
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

    toAliases() {
        return {
            php: this.hasPHP,
            php_laravel: this.hasLaravel,
            php_symfony: this.hasSymfony,
            nodejs: this.hasNodeJs,
            nodejs_expressjs: this.hasExpressJs,
            python: this.hasPython,
            python_django: this.hasDjango,
            java: this.hasJava,
            java_android: this.hasAndroid,
            csharp: this.hasCSharp,
            csharp_asp: this.hasAspNet,
            db_mysql: this.hasMySql,
            db_postgres: this.hasPostgres,
            javascript: this.hasJavascript,
            javascript_angular: this.hasAngular,
            javascript_react: this.hasReact,
            javascript_ember: this.hasEmber,
            javascript_jquery: this.hasJQuery
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

     static _sel(selection, alias, value) {         
        let oldVal = selection[alias] || 0;
        let newVal = oldVal + value;
        selection[alias] = newVal <= 1? newVal: 1;
        return selection[alias];
    }

    static expertRuleSelection(alias, selection = {}) {
        switch (alias) {
            case "javascript":
                this._sel(selection, "javascript", 0.8);
                this._sel(selection, "javascript_ember", 0.2);
                this._sel(selection, "javascript_angular", 0.2);
                this._sel(selection, "javascript_react", 0.2);
                this._sel(selection, "javascript_jquery", 0.2);
                this._sel(selection, "php", 0.4);               
                break;
            case "javascript_ember":
                this._sel(selection, "javascript_ember", 0.8);
                this._sel(selection, "javascript", 0.6);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "javascript_angular", 0.4);
                break;
            case "javascript_angular":
                this._sel(selection, "javascript_angular", 0.8);
                this._sel(selection, "javascript", 0.6);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "javascript_ember", 0.4);
                this._sel(selection, "javascript_react", 0.4);
                break;
            case "javascript_react":
                this._sel(selection, "javascript_react", 0.8);
                this._sel(selection, "javascript", 0.6);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "javascript_ember", 0.4);
                this._sel(selection, "javascript_angular", 0.4);
                break;
            case "javascript_jquery":
                this._sel(selection, "javascript_jquery", 0.8);
                this._sel(selection, "javascript", 0.6);     
                break;
            case "php":
                this._sel(selection, "php", 0.8);
                this._sel(selection, "php_laravel", 0.2);
                this._sel(selection, "php_symfony", 0.2);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "javascript_jquery", 0.4);
                break;
            case "php_laravel":
                this._sel(selection, "php_laravel", 0.8);
                this._sel(selection, "php", 0.6);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "php_symfony", 0.4);
                this._sel(selection, "csharp_asp", 0.2);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "javascript", 0.4);
                break;
            case "php_symfony":
                this._sel(selection, "php_symfony", 0.8);
                this._sel(selection, "php", 0.6);
                this._sel(selection, "php_laravel", 0.4);
                this._sel(selection, "db_mysql", 0.6);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "csharp_asp", 0.2);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "javascript", 0.4);
                break;
            case "nodejs":
                this._sel(selection, "nodejs", 0.8);
                this._sel(selection, "nodejs_expressjs", 0.2);
                this._sel(selection, "javascript", 0.6);
                this._sel(selection, "php", 0.4);
                this._sel(selection, "php_laravel", 0.2);
                this._sel(selection, "php_symfony", 0.2);
                this._sel(selection, "csharp_asp", 0.2);                
                break;
            case "nodejs_expressjs":
                this._sel(selection, "nodejs_expressjs", 0.8);
                this._sel(selection, "nodejs", 0.6);
                this._sel(selection, "javascript", 0.6);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "php_laravel", 0.2);
                this._sel(selection, "php_symfony", 0.2);
                this._sel(selection, "csharp_asp", 0.2);                                  
                break;
            case "python":
                this._sel(selection, "python", 0.8);
                this._sel(selection, "python_django", 0.2);
                this._sel(selection, "php", 0.4);
                break;
            case "python_django":
                this._sel(selection, "python_django", 0.8);
                this._sel(selection, "python", 0.6);
                this._sel(selection, "javascript", 0.4);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "php_laravel", 0.2);
                this._sel(selection, "php_symfony", 0.2);
                this._sel(selection, "csharp_asp", 0.2);                
                break;
            case "java":
                this._sel(selection, "java", 0.8);
                this._sel(selection, "java_android", 0.2);
                this._sel(selection, "csharp", 0.4);
                this._sel(selection, "db_mysql", 0.4);                
                this._sel(selection, "db_postgres", 0.4); 
                this._sel(selection, "javascript_ember", 0.2);                 
                break;
            case "java_android":
                this._sel(selection, "java_android", 0.8);
                this._sel(selection, "java", 0.6);
                break;
            case "csharp":
                this._sel(selection, "csharp", 0.8);
                this._sel(selection, "csharp_asp", 0.2);
                this._sel(selection, "java", 0.4);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);                  
                break;
            case "csharp_asp":
                this._sel(selection, "csharp_asp", 0.8);
                this._sel(selection, "csharp", 0.6);
                this._sel(selection, "javascript", 0.4);
                this._sel(selection, "javascript_jquery", 0.4);
                this._sel(selection, "db_mysql", 0.4);
                this._sel(selection, "db_postgres", 0.4);
                this._sel(selection, "php_laravel", 0.2);
                this._sel(selection, "php_symfony", 0.2);
                break;
            case "db_mysql":
                this._sel(selection, "db_mysql", 0.8);
                this._sel(selection, "db_postgres", 0.4);
                break;
            case "db_postgres":
                this._sel(selection, "db_postgres", 0.8);
                this._sel(selection, "db_mysql", 0.4);
                break;
        }
        return selection;
    }
}

module.exports = {
    VacancyStatsData,
    Technologies
}