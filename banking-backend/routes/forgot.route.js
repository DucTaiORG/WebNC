const express = require('express');
const userModel = require('../models/users.model');
const router = express.Router();
const mailer = require('../utils/mailer');

router.get('/sendEmail/:username', async (req, res)=>{
    console.log(req.params);
    const {username} = req.params;
    const users = await userModel.singleByUserName(username);
    console.log(users);
    
    if(users.length == 0){
        return res.status(204).end();
    }
    const email = users[0].email;
    
    const otp = await userModel.addForgotHistory(username);

    if(otp == null){
        return res.status(500).json({error: "Server error"});
    }

    const html = `Dear <b>${username}</b>,
    <br/>
    This email is sent from DTBank!
    <br/><br/>
    Did you forgot your password?
    <br/>
    This is your OTP: <b>${otp}</b>
    <br/>
    The OTP will expire in three hours
    <br/>
    Thanks for using our service!`;

    await mailer.sendEmail('ronin32014@gmail.com', email, 'Please verify transfer OTP!', html);
    return res.json({success: true});
});

router.post('/verify', async (req, res)=>{
    console.log(req.body);
    const {otpNum, username} = req.body;
    const ret = await userModel.verifyForgotOTP(username, otpNum);
    
    if(ret == null){
        return res.json({success: false});
    }else{
        return res.json({success: true});
    }
});

router.post('/resetPassword', async (req, res)=>{
    console.log(req.body);
    const {username, password} = req.body;
    const ret = await userModel.resetPassword(username, password);
    if(ret.affectedRows){
        return res.json({success: true});
    }
    return res.json({success: false});
});

module.exports = router;