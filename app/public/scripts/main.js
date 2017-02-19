"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

;(function (container, document) {
    var nnInputNames = ["PHP", "Laravel", "Symfony", "NodeJs", "ExpressJs", "Python", "Django", "Java", "Android", "CSharp", "Asp.Net", "MySql", "Postgres", "Javascript", "Angular", "React", "Ember", "Jquery"];

    requirejs.config({
        baseUrl: 'scripts/lib'
    });

    require(['synaptic'], function () {
        var NN_PATH = 'scripts/lib/nn_model.json';
        var SALARY_NORM_RATE = 1000000;
        var Network = synaptic.Network;;

        var nn = null;

        function createCheckbox(template, title, inputName) {
            var newNode = template.cloneNode(true);

            var titleNode = newNode.getElementsByClassName('technology__name')[0];
            titleNode.textContent = title;

            var input = newNode.getElementsByTagName('input')[0];
            input.setAttribute('name', inputName);

            return newNode;
        }

        function createCheckboxesForInputs() {
            var names = nnInputNames.map(function (name) {
                return {
                    title: name,
                    input: "select-" + name.replace(".", "").toLowerCase()
                };
            });

            var templateNode = document.querySelector('div.technology');
            var nodes = names.map(function (name) {
                return createCheckbox(templateNode, name.title, name.input);
            });

            var checkBoxContainer = templateNode.parentNode;
            checkBoxContainer.removeChild(templateNode);

            nodes.forEach(function (node) {
                return checkBoxContainer.appendChild(node);
            });
        }

        function startApp() {
            createCheckboxesForInputs();
            loadNN().then(initModel).then(function () {
                return "Neural Network has been loaded!";
            }).then(function (msg) {
                alert(msg);
            });
        }

        function logProgress(title, message) {
            console.log(title + ": " + message);
        }

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

        function initModel(jsonModel) {
            nn = Network.fromJSON(jsonModel);
        }

        function skillsToVec() {
            var checkboxes = [].concat(_toConsumableArray(document.querySelectorAll('[name^="select"]')));
            var vec = [0, 0, 0, 0];
            checkboxes.forEach(function (checkBox) {
                if (checkBox.checked) {
                    var name = checkBox.getAttribute('name');
                    switch (name.split('-')[1].toLowerCase()) {
                        case 'angular':
                            vec[0] = 1;break;
                        case 'react':
                            vec[1] = 1;break;
                        case 'ember':
                            vec[2] = 1;break;
                        case 'jquery':
                            vec[3] = 1;break;
                    }
                }
            });
            return vec;
        }

        function setSalary(normalizedSalary) {
            var salary = normalizedSalary * SALARY_NORM_RATE;
            var salaryLabel = document.getElementById('predicted-salary');
            salaryLabel.textContent = salary + " \u0440\u0443\u0431.";
            logProgress("NN", "Salary update");
        }

        function predict() {
            Promise.resolve(skillsToVec()).then(function (inputVec) {
                return nn.activate(inputVec);
            }).then(function (outputVec) {
                return setSalary(outputVec[0]);
            });
        }

        window.predictSalary = predict;

        startApp();
    });
})(window, document);