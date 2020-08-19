const express = require('express');
const depositModel = require('../models/deposit.model');
const userModel = require('../models/users.model');
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

router.get('/byAccountNum/:accNum', async (req, res) => {
    if(isNaN(req.params.accNum)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const accNum = req.params.accNum || -1;
    const list = await userModel.detailByAccNumber(accNum);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
});

router.get('/getUserId/:accNum', async (req, res) => {
    if(isNaN(req.params.accNum)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const accNum = req.params.accNum || -1;
    const list = await userModel.detailByAccNumber2(accNum);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
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
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    
    console.log(ret);
    return res.json(ret);
});

router.post('/Transfer', async (req, res)=>{
    console.log(req.body);
    const {userId} = req.body;
    const ret = await userModel.getTransferHistory(userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    return res.json(ret);
});

router.post('/Deposit', async (req, res)=>{
    console.log(req.body);
    const {userId} = req.body;
    const ret = await userModel.getDepositHistory(userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    return res.json(ret);
});

router.post('/Debt', async (req, res)=>{
    console.log(req.params);
    const ret = await userModel.getPayDebtHistory(req.body.userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    console.log(ret);
    
    return res.json(ret);
});

module.exports = router;