const express = require('express');
const userModel = require('../models/users.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');


const router = express.Router();

const secretKey = "NganHangB";
router.get('/', async (req, res) => {
    const list = await userModel.all();
    console.log(list);
    res.json(list);
})

//api get user detail
router.get('/:id', async (req, res) => {
    if(isNaN(req.params.id)){
        return res.status(400).json({
            err: 'Invalid Id'
        });
    }
    const id = +req.params.id || -1;
    
    const ts = +req.headers['time'] || 0;
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Expired request';
        return res.status(203).json({error});
    }

    const headerSig = req.headers['sig'] || 0;
    
    const sig = crypto.createHash('sha256').update(ts + secretKey).digest('hex');
    if(sig !== headerSig){
        const error = 'Not original request';
        return res.status(203).json({error});
    }

    const code = await authModel.detail(req.headers['bank-code']);
    if(code.length === 0){
        const error = 'Can not identify bank';
        return res.status(203).json({error});
    }
    const list = await userModel.detail(id);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
})

module.exports = router;