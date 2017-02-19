; (function (container, document) {
    const nnInputs = [{ technology: "PHP", isSelected: false }, { technology: "Laravel", isSelected: false }, { technology: "Symfony", isSelected: false }, { technology: "NodeJs", isSelected: false }, { technology: "ExpressJs", isSelected: false }, { technology: "Python", isSelected: false }, { technology: "Django", isSelected: false }, { technology: "Java", isSelected: false }, { technology: "Android", isSelected: false }, { technology: "CSharp", isSelected: false }, "Asp.Net", { technology: "MySql", isSelected: false }, { technology: "Postgres", isSelected: false }, { technology: "Javascript", isSelected: false }, { technology: "Angular", isSelected: false }, { technology: "React", isSelected: false }, { technology: "Ember", isSelected: false }, { technology: "Jquery", isSelected: false }];

    requirejs.config({
        baseUrl: 'scripts/lib'
    });

    require(['synaptic'], () => {
        const NN_PATH = 'scripts/lib/nn_model.json';
        const SALARY_NORM_RATE = 1000000;
        let Network = synaptic.Network;;

        let nn = null;

        function createCheckbox(template, title, inputName) {
            let newNode = template.cloneNode(true);

            let titleNode = newNode.getElementsByClassName('technology__name')[0];
            titleNode.textContent = title;

            let input = newNode.getElementsByTagName('input')[0];
            input.setAttribute('name', inputName);

            return newNode;
        }

        function createCheckboxesForInputs() {
            let names = nnInputs.map(nnInput => {
                return {
                    title: nnInput.technology,
                    input: "select-" + nnInput.technology.replace(".", "").toLowerCase()
                }
            })

            let templateNode = document.querySelector('div.technology');
            let nodes = names.map(name => {
                return createCheckbox(templateNode, name.title, name.input)
            })

            let checkBoxContainer = templateNode.parentNode;
            checkBoxContainer.removeChild(templateNode);

            nodes.forEach(node => checkBoxContainer.appendChild(node));
        }        

        function startApp() {
            createCheckboxesForInputs();
            loadNN()
                .then(initModel)
                .then(() => "Neural Network has been loaded!")
                .then((msg) => {
                    alert(msg)
                });
        }

        function logProgress(title, message) {
            console.log(`${title}: ${message}`);
        }

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

        function initModel(jsonModel) {
            nn = Network.fromJSON(jsonModel);
        }

        function skillsToVec() {
            let checkboxes = [...document.querySelectorAll('[name^="select"]')];
            let vec = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0];
            checkboxes.forEach((checkBox) => {
                if (checkBox.checked) {
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
            logProgress("NN", "Salary update");
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




