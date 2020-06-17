const express = require('express');
const router = express.Router();
const transferModel = require('../models/transfer.model');
const mailer = require('../utils/mailer');
const moment = require('moment');
const usersModel = require('../models/users.model');

router.post('/', async (req, res)=>{
    console.log(req.body);
    const toAcc = req.body.toAcc;
    const fromAcc = req.body.fromAcc;
    const moneyAmount = req.body.moneyAmount;
    const feeType = req.body.transferFeeType;
    const otp = req.body.otpNum;
    const ret = await transferModel.transfer(fromAcc, toAcc, moneyAmount, feeType, otp);

    if(ret == null || ret == 2){
        return res.status(400).json({error: "Can not transfer"});
    }

    if(ret == 1){
        return res.status(500).json({error: "Can not transfer"});
    }
    
    return res.json({success: true});
});

router.post('/addHistory', async (req, res)=>{
    console.log(req.body);
    const {toAcc, fromAcc, moneyAmount} = req.body;
    const ret = await transferModel.addToHistory(fromAcc, toAcc, moneyAmount);
    const userList = await usersModel.detailByAccNumber(fromAcc);
    const email = userList[0].email;

    if(ret === null){
        return res.status(500).json("Server error");
    }

    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const html = `Dear ${fromAcc},
    <br/>
    This email is sent from DTBank!
    <br/><br/>
    You have transfered ${moneyAmount} from ${fromAcc} account number to ${toAcc} account number at ${time}
    <br/>
    This is your OTP: ${ret}
    <br/>
    The OTP will expire in three hours
    <br/>
    Thanks for using our service!`;

    await mailer.sendEmail('ronin32014@gmail.com', email, 'Please verify transfer OTP!', html);
    return res.json({success: true});
});

router.post('/verify', async (req, res)=>{
    console.log(req.body);
    const {fromAcc, otpNum} = req.body;
    const ret = await transferModel.verifyOTP(fromAcc, otpNum);
    
    if(ret){
        return res.json({success: true});
    }else{
        return res.json({success: false});
    }
});

module.exports = router;