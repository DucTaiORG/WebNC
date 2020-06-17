const express = require('express');
const depositModel = require('../models/deposit.model');
const router = express.Router();
const moment = require('moment');

router.post('/', async (req, res) =>{
    console.log(req.body);
    const accNum = req.body.accountNumber || -1;
    const moneyAmount = req.body.moneyAmount || -1;

    const ret = await depositModel.depositMoney(accNum, moneyAmount);
    if(ret === null){
        const error = "Account number not found";
        return res.status(400).json({error});
    }

    if(ret === 1){
        return res.status(500).json({error: 'Server error'});
    }

    if(ret.changedRows === 1){
        return res.json({"success": true});
    }

    return res.status(503).json({error: "Can not deposit"});
});

router.post('/history', async (req, res)=>{
    console.log(req.body);
    const accNum = req.body.accountNumber || -1;
    const ret = await depositModel.getDepositHistory(accNum);
    if(ret === null){
        const error = "Account number not found";
        return res.status(400).json({error});
    }
    ret.forEach(element => {
       element.deposit_time = moment(element.deposit_time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    
    return res.json(ret);
});

module.exports = router;