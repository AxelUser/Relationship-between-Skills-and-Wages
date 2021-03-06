"use strict";

;(function (window) {
    var nnInputNames = [{ caption: "PHP", name: "php", value: 0 }, { caption: "Laravel", name: "laravel", value: 0 }, { caption: "Symfony", name: "symfony", value: 0 }, { caption: "NodeJs", name: "nodejs", value: 0 }, { caption: "ExpressJs", name: "expressjs", value: 0 }, { caption: "Python", name: "python", value: 0 }, { caption: "Django", name: "django", value: 0 }, { caption: "Java", name: "java", value: 0 }, { caption: "Android", name: "android", value: 0 }, { caption: "CSharp", name: "csharp", value: 0 }, { caption: "Asp.Net", name: "aspnet", value: 0 }, { caption: "MySql", name: "mysql", value: 0 }, { caption: "Postgres", name: "postgres", value: 0 }, { caption: "Javascript", name: "javascript", value: 0 }, { caption: "Angular", name: "angular", value: 0 }, { caption: "React", name: "react", value: 0 }, { caption: "Ember", name: "ember", value: 0 }, { caption: "JQuery", name: "jquery", value: 0 }];

    require(['lib/synaptic', 'lib/vue.min'], function (Synaptic, Vue) {
        var NN_PATH = 'scripts/lib/nn_model.json?v=2.5';
        var Network = synaptic.Network;
        var nn = null;
        var stats = null;

        /**
         * Load neural network and start wage-prediction application.
         * 
         */
        function startAppAsync(inputs) {
            return new Promise(function (res, rej) {
                loadNN().then(initModel).then(function () {
                    return "Neural Network has been loaded!";
                }).then(function (msg) {
                    logProgress("NN", msg);
                }).then(predict(inputs)).then(res());
            });
        }

        /**
         * Send message to logs.
         * 
         * @param {any} title 
         * @param {any} message 
         */
        function logProgress(title, message) {
            console.log(title + ": " + message);
        }

        /**
         * Asynchronous load of neural network.
         * 
         * @returns {Promise<string>}
         */
        function loadNN() {
            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open('GET', NN_PATH, false);
                req.send(null);
                var jsonModel = null;
                if (req.status === 200) {
                    logProgress("NN", "Loaded");
                    jsonModel = JSON.parse(req.responseText);
                    resolve(jsonModel);
                } else {
                    logProgress("NN", "Loading failed");
                    reject(req.responseText);
                }
            });
        }

        /**
         * Initialize neural network from model.
         * 
         * @param {string} jsonModel 
         */
        function initModel(dataFile) {
            nn = Network.fromJSON(dataFile.model);
            stats = dataFile.stats;
        }

        /**
         * Get input vector for neural networ.
         * 
         * @returns number[]
         */
        function skillsToVec(inputs) {
            return inputs.map(function (input) {
                return input.value / 5;
            });
        }

        function getSourceValue(centeredValue, meanValue, maxValue) {
            var res = centeredValue * maxValue; // + meanValue;
            return res >= 0 ? res : 0;
        }

        /**
         * Render salary.
         * 
         * @param {number} normalizedSalary 
         */
        function setSalary(normalizedSalaryFrom, normalizedSalaryTo) {
            var salaryFrom = getSourceValue(normalizedSalaryFrom, stats.meanSalaryFrom, stats.maxSalaryFrom);
            var salaryTo = getSourceValue(normalizedSalaryTo, stats.meanSalaryTo, stats.maxSalaryTo);
            app.salaryFrom = salaryFrom.toFixed();
            app.salaryTo = salaryTo.toFixed();
            logProgress("NN", "Salary updated");
        }

        /**
         * Predict salary for chosen inputs.
         * 
         */
        function predict(inputs) {
            Promise.resolve(skillsToVec(inputs)).then(function (inputVec) {
                return nn.activate(inputVec);
            }).then(function (outputVec) {
                return setSalary(outputVec[0], outputVec[1]);
            });
        }

        /**
         * MVVM using VueJs.
         * 
         */

        var app = new Vue({
            el: '#wage-prediction-app',
            data: {
                salaryFrom: 80000,
                salaryTo: 120000,
                nnInputs: nnInputNames,
                isLoading: true
            },
            watch: {
                nnInputs: {
                    handler: function handler(val, oldVal) {
                        predict(val);
                    },

                    deep: true
                }
            },
            mounted: function mounted() {
                startAppAsync(this.nnInputs).then(this.isLoading = false);
            }
        });

        window.WagePredictionApp = app;
    });
})(window);