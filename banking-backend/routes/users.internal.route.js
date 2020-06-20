const express = require('express');
const userModel = require('../models/users.model');
const moment = require('moment');
const router = express.Router();

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

router.get('/byUserId/:id', async (req, res)=>{
    if(isNaN(req.params.id)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const id = req.params.id || -1;
    const list = await userModel.detailBalanceByUserId(id);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
});

router.post('/transferHistory', async (req, res)=>{
    console.log(req.body);
    const {userId} = req.body;
    const ret = await userModel.getTransferHistory(userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    return res.json(ret);
});

router.post('/depositHistory', async (req, res)=>{
    console.log(req.body);
    const {userId} = req.body;
    const ret = await userModel.getDepositHistory(userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    return res.json(ret);
});



module.exports = router;