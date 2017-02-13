; (function (container, document) {
    requirejs.config({
        baseUrl: 'scripts/lib',
        shim: {
            'synaptic': {
                exports: 'Synaptic'
            }
        }
    });

    require(['synaptic'], () => {
        const NN_PATH = 'scripts/lib/nn_model.json';
        const SALARY_NORM_RATE = 1000000;
        let Network = synaptic.Network;;

        let nn = null;

        function startApp() {
            LogProgress("APP", "Started");
            loadNN()
            .then(initModel)
            .then(() => "Neural Network has been loaded!")
            .then((msg) => {
                alert(msg)
            });
        }
        
        function LogProgress(title, message) {
            console.log(`${title}: ${message}`);
        }

        function loadNN() {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest();
                req.open('GET', NN_PATH, false);
                req.send(null);
                let jsonModel = null;
                if (req.status === 200) {
                    LogProgress("NN", "Loaded");
                    jsonModel = JSON.parse(req.responseText);
                    resolve(jsonModel);
                } else {
                    LogProgress("NN", "Loading failed");
                    reject(req.responseText);
                }
            })
        }

        function initModel(jsonModel) {
            nn = Network.fromJSON(jsonModel);
        }

        function skillsToVec() {
            let checkboxes = [...document.querySelectorAll('[name^="select"]')];
            let vec = [0, 0, 0, 0];
            checkboxes.forEach((checkBox) => {
                if(checkBox.checked){
                    let name = checkBox.getAttribute('name');
                    switch (name.split('-')[1].toLowerCase()) {
                        case 'angular': vec[0] = 1; break;
                        case 'react': vec[1] = 1; break;
                        case 'ember': vec[2] = 1; break;
                        case 'jquery': vec[3] = 1; break;
                    }
                }
            });
            return vec;
        }

        function setSalary(normalizedSalary) {
            let salary = normalizedSalary * SALARY_NORM_RATE;
            let salaryLabel = document.getElementById('predicted-salary');
            salaryLabel.textContent = `${salary} руб.`;
            LogProgress("NN", "Salary update");
        }

        function predict() {
            Promise.resolve(skillsToVec())
                .then((inputVec) => nn.activate(inputVec))
                .then((outputVec) => setSalary(outputVec[0]))
        }

        window.predictSalary = predict;

        startApp();
    });


})(window, document);




