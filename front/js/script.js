/*
Vamos estruturar um pequeno app utilizando módulos.
Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
seguinte forma:
- No início do arquivo, deverá ter as informações da sua empresa - nome e
telefone (já vamos ver como isso vai ser feito)
- Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
um formulário para cadastro do carro, com os seguintes campos:
  - Imagem do carro (deverá aceitar uma URL)
  - Marca / Modelo
  - Ano
  - Placa
  - Cor
  - e um botão "Cadastrar"
Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
aparecer no final da tabela.
Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
Dê um nome para a empresa e um telefone fictício, preechendo essas informações
no arquivo company.json que já está criado.
Essas informações devem ser adicionadas no HTML via Ajax.
Parte técnica:
Separe o nosso módulo de DOM criado nas últimas aulas em
um arquivo DOM.js.
E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
que será nomeado de "app".
*/

import DOM from './DOM.js';

((document) => {
    'use strict';

    const app = (function () {

        const $form = DOM('[name="form"]');
        const $fields = new DOM('.form__input').getAll();
        const $tbody = new DOM('tbody').get();
        const $h1 = new DOM('h1').get();
        const url = 'http://localhost:3000/car';

        return {
            init: function init() {
                this.companyInfo();
                this.getCars();
                this.initEvents();
            },

            initEvents: function initEvents() {
                $form.on('submit', this.handleSubmit);
            },

            handleSubmit: function handleSubmit(e) {
                e.preventDefault();
                app.postCar();
                app.clearFields()
            },

            companyInfo: function companyInfo() {
                const ajax = new XMLHttpRequest();
                ajax.open('GET', './data/company.json');
                ajax.send()
                ajax.addEventListener('load', this.handleCompanyInfo);
            },

            handleCompanyInfo: function handleCompanyInfo() {
                if (app.isRequestOk(this))
                    try {
                        const data = JSON.parse(this.response);
                        $h1.textContent = `${data.name} - ${data.phone}`
                    } catch(e) {
                        console.log(e);
                    }
            },

            loadCars: function loadCars(cars) {
                cars.forEach((car) => {
                    this.addCarToList(car);
                });
            },

            addCarToList: function addCarToList(car) {
                const tr = this.elt('tr');
                for(let key in car) {
                    if (key === 'picture') {
                        tr.appendChild(this.createImgElement(car[key]));
                        continue;
                    }
                    const th = this.elt('th', null, car[key]);
                    tr.appendChild(th);
                }
                // DONE: REMOVE CAR FROM PLATE
                const buttonRemove = this.createButtonElement('Remover', car['placa']);
                const th = this.elt('th', null, buttonRemove);

                tr.appendChild(th);
                $tbody.appendChild(tr);
            },

            clearFields: function clearFields() {
                $fields.forEach((field) => {
                   field.value = '';
                });
            },

            postCar: function postCar() {
                const ajax = new XMLHttpRequest();
                const formData = new FormData();
                const car = {};

                // TODO: CHECK EVERY FIELD IF ISNT NULL
                $fields.forEach((field) => {
                    car[field.name] = field.value;
                    formData.append(field.name, field.value);
                })

                ajax.addEventListener('load',() => {
                    this.showMessage('success');
                });

                ajax.addEventListener('error',() => {
                    this.showMessage('error');
                });

                ajax.open('POST', url);
                ajax.send(formData);
                this.addCarToList(car);
            },

            getCars: function getCars() {
                const ajax = new XMLHttpRequest();
                ajax.open('GET', url);
                ajax.addEventListener('load', this.handleLoadedCars);
                ajax.send();
            },

            handleLoadedCars: function handleLoadedCars() {
                if (app.isRequestOk(this))
                    try {
                        const data = JSON.parse(this.response);
                        app.loadCars(data);
                    } catch (e) {
                        console.log(e)
                    }
            },

            showMessage(type) {
                const messages = {
                    'success': 'Carro cadastrado com sucesso!',
                    'error': 'Carro não cadastrado!',
                    'deleted': 'Carro deletado!'
                };
                // TODO: CHANGE MESSAGE ALERT TO A SPAN ANIMATED
                alert(messages[type]);
            },

            isRequestOk: function isRequestOk(ajax) {
                return ajax.readyState === 4 && ajax.status === 200;
            },

            createImgElement: function createImgElement(src) {
                const img = this.elt('img', {src: src});
                const th = this.elt('th', null, img);
                return th;
            },

            createButtonElement: function createButtonElement(text, placa) {
                const button = this.elt('button', {class: "button--red", data_js: placa }, text);
                button.addEventListener('click', this.handleRemoveItem);
                return button;
            },

            handleRemoveItem: function handleRemoveItem() {
                const placa = this.getAttribute('data_js');
                const ajax = new XMLHttpRequest();
                ajax.open('DELETE', url);
                ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                ajax.send(`placa=${placa}`);

                this.parentNode.parentNode.remove();
            },

            elt: function elt(tag, attributes, ...args) {
                const node = document.createElement(tag);

                if (attributes)
                    for (let attr in attributes)
                        node.setAttribute(attr, attributes[attr]);

                if (args.length)
                    for(let i = 0; i < args.length; i++) {
                        let child = args[i];
                        if (typeof child === 'string')
                            child = document.createTextNode(args[i]);
                        node.appendChild(child);
                    }
                return node;
            }
        }
    })();

    app.init();

})(document);
