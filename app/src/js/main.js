; (function (window) {
    const nnInputNames = [{ caption: "PHP", name: "php", value: 0 }, { caption: "Laravel", name: "laravel", value: 0 }, { caption: "Symfony", name: "symfony", value: 0 }, { caption: "NodeJs", name: "nodejs", value: 0 }, { caption: "ExpressJs", name: "expressjs", value: 0 }, { caption: "Python", name: "python", value: 0 }, { caption: "Django", name: "django", value: 0 }, { caption: "Java", name: "java", value: 0 }, { caption: "Android", name: "android", value: 0 }, { caption: "CSharp", name: "csharp", value: 0 }, { caption: "Asp.Net", name: "aspnet", value: 0 }, { caption: "MySql", name: "mysql", value: 0 }, { caption: "Postgres", name: "postgres", value: 0 }, { caption: "Javascript", name: "javascript", value: 0 }, { caption: "Angular", name: "angular", value: 0 }, { caption: "React", name: "react", value: 0 }, { caption: "Ember", name: "ember", value: 0 }, { caption: "JQuery", name: "jquery", value: 0 }];

    requirejs.config({
        baseUrl: 'scripts/lib'
    });

    require(['synaptic', 'vue.min'], (Synaptic, Vue) => {
        const NN_PATH = 'scripts/lib/nn_model.json';
        const SALARY_NORM_RATE = 1000000;
        let Network = synaptic.Network;
        let nn = null;

        /**
         * Load neural network and start wage-prediction application.
         * 
         */
        function startAppAsync() {
            return new Promise((res, rej) => {
                loadNN()
                    .then(initModel)
                    .then(() => "Neural Network has been loaded!")
                    .then((msg) => {
                        logProgress("NN", msg);
                    })
                    .then(predict())
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
        function initModel(jsonModel) {
            nn = Network.fromJSON(jsonModel);
        }


        /**
         * Get input vector for neural networ.
         * 
         * @returns number[]
         */
        function skillsToVec() {
            return nnInputNames.map(nnInputName => nnInputName.value / 5);
        }


        /**
         * Render salary.
         * 
         * @param {number} normalizedSalary 
         */
        function setSalary(normalizedSalaryFrom, normalizedSalaryTo) {
            let salaryFrom = Math.round(normalizedSalaryFrom * SALARY_NORM_RATE);
            let salaryTo = Math.round(normalizedSalaryTo * SALARY_NORM_RATE);
            app.salaryFrom = salaryFrom;
            app.salaryTo = salaryTo;
            logProgress("NN", "Salary updated");
        }

        /**
         * Predict salary for chosen inputs.
         * 
         */
        function predict() {
            Promise.resolve(skillsToVec())
                .then((inputVec) => nn.activate(inputVec))
                .then((outputVec) => setSalary(outputVec[0], outputVec[1]))
        }

        /**
         * MVVM using VueJs.
         * 
         */

        const grades = ['No', 'Beginner', 'Middle', 'Advanced', 'Expert'];

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
                        predict();
                    },
                    deep: true
                }
            },
            methods: {
                getGrade(value) {
                    return grades[value];
                }
            },
            mounted() {
                startAppAsync().then(this.isLoading = false)
            }
        });

        window.WagePredictionApp = app;
    });
})(window);




