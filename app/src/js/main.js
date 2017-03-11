; (function (window) {
    const nnInputNames = [{ caption: "PHP", name: "php", value: 0 }, { caption: "Laravel", name: "laravel", value: 0 }, { caption: "Symfony", name: "symfony", value: 0 }, { caption: "NodeJs", name: "nodejs", value: 0 }, { caption: "ExpressJs", name: "expressjs", value: 0 }, { caption: "Python", name: "python", value: 0 }, { caption: "Django", name: "django", value: 0 }, { caption: "Java", name: "java", value: 0 }, { caption: "Android", name: "android", value: 0 }, { caption: "CSharp", name: "csharp", value: 0 }, { caption: "Asp.Net", name: "aspnet", value: 0 }, { caption: "MySql", name: "mysql", value: 0 }, { caption: "Postgres", name: "postgres", value: 0 }, { caption: "Javascript", name: "javascript", value: 0 }, { caption: "Angular", name: "angular", value: 0 }, { caption: "React", name: "react", value: 0 }, { caption: "Ember", name: "ember", value: 0 }, { caption: "JQuery", name: "jquery", value: 0 }];

    require(['lib/synaptic', 'lib/vue.min'], (Synaptic, Vue) => {
        const NN_PATH = 'scripts/lib/nn_model.json?v=2.5';
        let Network = synaptic.Network;
        let nn = null;
        let stats = null;

        /**
         * Load neural network and start wage-prediction application.
         * 
         */
        function startAppAsync(inputs) {
            return new Promise((res, rej) => {
                loadNN()
                    .then(initModel)
                    .then(() => "Neural Network has been loaded!")
                    .then((msg) => {
                        logProgress("NN", msg);
                    })
                    .then(predict(inputs))
                    .then(res())
            })
        }


        /**
         * Send message to logs.
         * 
         * @param {any} title 
         * @param {any} message 
         */
        function logProgress(title, message) {
            console.log(`${title}: ${message}`);
        }


        /**
         * Asynchronous load of neural network.
         * 
         * @returns {Promise<string>}
         */
        function loadNN() {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest();
                req.open('GET', NN_PATH, false);
                req.send(null);
                let jsonModel = null;
                if (req.status === 200) {
                    logProgress("NN", "Loaded");
                    jsonModel = JSON.parse(req.responseText);
                    resolve(jsonModel);
                } else {
                    logProgress("NN", "Loading failed");
                    reject(req.responseText);
                }
            })
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
            return inputs.map(input => input.value / 5);
        }

        function getSourceValue(centeredValue, meanValue, maxValue) {
            let res = centeredValue * maxValue;// + meanValue;
            return res >= 0 ? res : 0;
        }

        /**
         * Render salary.
         * 
         * @param {number} normalizedSalary 
         */
        function setSalary(normalizedSalaryFrom, normalizedSalaryTo) {
            let salaryFrom = getSourceValue(normalizedSalaryFrom, stats.meanSalaryFrom, stats.maxSalaryFrom);
            let salaryTo = getSourceValue(normalizedSalaryTo, stats.meanSalaryTo, stats.maxSalaryTo);
            app.salaryFrom = salaryFrom.toFixed();
            app.salaryTo = salaryTo.toFixed();
            logProgress("NN", "Salary updated");
        }

        /**
         * Predict salary for chosen inputs.
         * 
         */
        function predict(inputs) {
            Promise.resolve(skillsToVec(inputs))
                .then((inputVec) => nn.activate(inputVec))
                .then((outputVec) => setSalary(outputVec[0], outputVec[1]))
        }

        /**
         * MVVM using VueJs.
         * 
         */

        const app = new Vue({
            el: '#wage-prediction-app',
            data: {
                salaryFrom: 80000,
                salaryTo: 120000,
                nnInputs: nnInputNames,
                isLoading: true
            },
            watch: {
                nnInputs: {
                    handler(val, oldVal) {
                        predict(val);
                    },
                    deep: true
                }
            },
            mounted() {
                startAppAsync(this.nnInputs).then(this.isLoading = false)
            }
        });

        window.WagePredictionApp = app;
    });
})(window);




