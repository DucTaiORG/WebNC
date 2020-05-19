const express = require('express');
const nopTienModel = require('../models/noptien.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');

const router = express.Router();

const secretKey = "NganHangB";
router.get('/', async (req, res) => {
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    console.log(list);
    var sodu = Number(list[0].SoDu);
    res.json(sodu);
})

router.put('/update', async(req, res) => {
    console.log(req.body.SoDu);
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    var sodu = Number(list[0].SoDu);
    if(isNaN(req.body.SoTaiKhoan)){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }
    
    const result = await nopTienModel.update(Number(req.body.SoDu) + sodu, req.body.SoTaiKhoan);
    res.status(201).json(result);
})

module.exports = router;