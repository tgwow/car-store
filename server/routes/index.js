'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer();
const data = [];

router.get('/', function(req, res) {
    console.log('[GET] /car:', data);

    res.json(data);
});

router.post('/', upload.none(), function(req, res) {
    const {
        picture,
        marca,
        ano,
        placa,
        cor
    } = req.body;

    const car = {
        picture,
        marca,
        ano,
        placa,
        cor
    }
    data.push(car);

    console.log('[POST] /car:', data);

    res.json({ message: 'success' });
});

module.exports = router;
