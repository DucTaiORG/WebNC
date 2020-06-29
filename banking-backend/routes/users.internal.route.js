const express = require('express');
const userModel = require('../models/users.model');
const moment = require('moment');
const router = express.Router();
const mailer = require('../utils/mailer');

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

router.post('/addDebt', async (req, res)=>{
    console.log(req.body);
    const {fromAcc, toAcc, moneyAmount, content} = req.body;
    const ret = await userModel.addDebt(fromAcc, toAcc, moneyAmount, content);
    
    if(ret == null){
        return res.status(204).end();
    }
    
    return res.json({success: true});
});

router.get('/getDebt/:id', async (req, res)=>{
    console.log(req.params);
    const ret = await userModel.getAllDebtByUserId(req.params.id);
    if(ret.length == 0){
        return res.status(204).end();
    }

    ret.forEach(item => {
        item.time = moment(item.time).format('HH:mm:ss DD/MM/YYYY');
    });
    return res.json(ret);
    
});

router.post('/addPaydebtHistory', async (req, res)=>{
    console.log(req.body);
    const debtId = req.body.id;
    const userId = req.body.userId;
    const debtList = await userModel.getDebtById(debtId);
    const {lender, debtor, money_amount} = debtList[0];
    const ret = await userModel.addPaydebtHistory(debtId, userId);
    const userList = await userModel.detailByUserId(userId);
    const email = userList[0].email;
    if(ret == null){
        return res.status(500).json("Server error");
    }

    if(ret == 1){
        return res.status(401).json("Not debtor");
    }

    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const html = `Dear ${debtor},
    <br/>
    This email is sent from DTBank!
    <br/><br/>
    You have transfered ${money_amount} from ${debtor} account number to ${lender} account number at ${time}
    <br/>
    This is your OTP: ${ret}
    <br/>
    The OTP will expire in three hours
    <br/>
    Thanks for using our service!`;

    await mailer.sendEmail('ronin32014@gmail.com', email, 'Please verify transfer OTP!', html);
    return res.json({success: true});
});

router.post('/verifyPayOTP', async (req, res)=>{
    console.log(req.body);
    const {otpNum} = req.body;
    const ret = await userModel.verifyPayOTP(otpNum);
    
    if(ret == null){
        return res.json({success: false});
    }else{
        return res.json({success: true});
    }
});

router.post('/payDebt', async (req, res)=>{
    console.log(req.body);
    const {debtId, userId, otp} = req.body;
    const ret = await userModel.payDebt(debtId, userId, otp);

    if(ret == null){
        return res.status(400).json({success: false, message: 'Client error'});
    }
    if(ret == 2){
        return res.status(400).json({success: false, message: 'Not enough money'});
    }
    if(ret == 3){
        return res.status(500).json({success: false, message: 'Server error'});
    }
    return res.json({success: true});
});

router.get('/delDebt/:id', async (req, res)=>{
    console.log(req.params);
    const ret = await userModel.delDebt(req.params.id);
    if(ret){
        return res.json({success: true});
    }
    return res.json({success: false}); 
});

router.post('/paydebtHistory', async (req, res)=>{
    console.log(req.params);
    const ret = await userModel.getPayDebtHistory(req.body.userId);
    ret.forEach(element => {
        element.time = moment(element.time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    console.log(ret);
    
    return res.json(ret);
});

module.exports = router;