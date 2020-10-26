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

import DOM from './29-javascript-thiago-oliveira-DOM.js';

((document) => {
    'use strict';

    const app = (function () {

        const $form = DOM('[name="form"]');
        const $fields = new DOM('.form__input').getAll();
        const $tbody = new DOM('tbody').get();
        const $h1 = new DOM('h1').get();

        return {
            init: function init() {
                this.initEvents();
                this.companyInfo();
            },

            initEvents: function initEvents() {
                $form.on('submit', this.handleSubmit);
            },

            handleSubmit: function handleSubmit(e) {
                e.preventDefault();
                app.addNewCar();
            },

            companyInfo: function companyInfo() {
                const ajax = new XMLHttpRequest();
                ajax.open('GET', '../data/company.json');
                ajax.send()
                ajax.addEventListener('load', this.handleRequestLoaded);
            },

            handleRequestLoaded: function handleRequestLoaded() {
                if (app.isRequestOk(this))
                    try {
                        const data = JSON.parse(this.response);
                        $h1.textContent = `${data.name} - ${data.phone}`
                    } catch(e) {
                        console.log(e);
                    }
            },

            addNewCar: function addNewCar() {
                const tr = document.createElement('tr');

                $fields.forEach((field) => {
                    if (field.name === 'picture') {
                        const th = document.createElement('th');
                        const img = document.createElement('img')
                        img.setAttribute('src', field.value);
                        th.appendChild(img);
                        tr.appendChild(th);
                        return;
                    }

                    const th = document.createElement('th');
                    th.textContent = field.value;
                    tr.appendChild(th);
                });
                $tbody.appendChild(tr);
            },

            isRequestOk: function isRequestOk(ajax) {
                return ajax.readyState === 4 && ajax.status === 200;
            }
        }
    })();

    app.init();

})(document);
