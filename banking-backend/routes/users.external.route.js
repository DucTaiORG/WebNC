const express = require('express');
const userModel = require('../models/users.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');


const router = express.Router();

router.get('/', async (req, res) => {
    const list = await userModel.all();
    console.log(list);
    res.json(list);
})

//api get user detail
router.get('/:accNum', async (req, res) => {
    if(isNaN(req.params.accNum)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const accNum = +req.params.accNum || -1;
    
    const ts = +req.headers['x-time'] || 0;
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Expired request';
        return res.status(203).json({error});
    }

    const bank = await authModel.detail(req.headers['x-partner-code']);
    if(bank.length === 0){
        const error = 'Can not identify bank';
        return res.status(203).json({error});
    }

    const headerSig = req.headers['x-signature'] || 0;
    
    const sig = crypto.createHash('sha256').update(ts + bank[0].secretKey).digest('hex');
    console.log(sig);
    if(sig !== headerSig){
        const error = 'Not original request';
        return res.status(203).json({error});
    }

    const code = await authModel.detail(req.headers['x-partner-code']);
    if(code.length === 0){
        const error = 'Can not identify bank';
        return res.status(203).json({error});
    }
    const list = await userModel.detailByAccNumber(accNum);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
})

module.exports = router;