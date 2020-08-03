const express = require('express');
const moment = require('moment');
const axios = require('axios');
const md5 = require('md5');
const NodeRSA = require('node-rsa');
const transferModel = require('../models/transfer.model');
const usersModel = require('../models/users.model');
const mailer = require('../utils/mailer');

const router = express.Router();

const bankCode = 'partner34';
const secretKey = md5('banking34');
const privateKeyRSA = "-----BEGIN RSA PRIVATE KEY-----\nMIICWwIBAAKBgQCnWNNINaUTlo2ZxB3YoZf/drwG9vjJEoiAb9Zll1ufVCSLcvb+\na3Hag7xlCrEzhWKcUFv8N4SBxem03qzcE3VyfViYIO9REVYtjN8PiMcBpVNUFbk4\n1P6QcQdOpHPeGMNyaIcdqcIO9ms4ftwn8OIsPgd0ipT4NhaSGrNgB9QepwIDAQAB\nAoGAHVL3UwPzdUdAcN1ozXkjhWRs9lt4pONWgAsY6pxnNbgs3zK6DUMOpFfJP3ts\nKbcJ3JJITB3+Xi8sEMGkULwoLCrksnTNB9dvjflYEFzQU3IclvKxXRaodStVUYpE\nS2eUQ2kXJa0GqbuaAV6k8P1P5cVreA6Ga3uyOKcCxtwpsgECQQDjooyFtpgsvmeG\n6AjRWxRmLL3UxgP4MYSI4Vq0AAA8eysS6T8NwtAyMjXzHU3NPtp33Zp+9LS8Z5WX\n9TtYMCHnAkEAvDMeB9bNTUn87jNxm9p9G9bvyz3vCzkIQXBMlL9asqYEKT5POV7F\ncrq6IJqRr1f+SK1XSAbC8A9eY6LQ+z4FQQJARtfTu9lzypkHRyj3dZBO7O2HtqxZ\nl+hxQtg/jj1h1XDPmvcUNIgomzadK6g3CmVBQISrDE/D386s87nSWkPAiQJARd4M\nRgi+ivTuy1eZ06xXSeCPgTpq5hW0NOcF5yrq9uufG9if/MJsNt2Pf88iSqA2LLD9\neCXadNifyAmH3930gQJAVRxjFcEmdtedva5uH8Vz3Qceccdd5TG5xP6+jkkqG+DQ\nadIYlvqXJcfuvqRAxwzMjj3jOSPLVnEDBIZHVraaIA==\n-----END RSA PRIVATE KEY-----";
router.get('/check/:stk', async (req, res)=>{
    const soTaiKhoan = +req.params.stk || -1
    if(soTaiKhoan === -1){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }

    const ts = moment().valueOf();
    const body = {
        account_number: soTaiKhoan.toString()
    }
    const hash = md5(ts + JSON.stringify(body) + secretKey);
    const config = {
        headers: {
            partnerCode: bankCode,
            ts: ts,
            sig: hash
        }
    }
    console.log(config);
    axios.post('https://tts-bank.herokuapp.com/partner/check', body, config).then(function (response){
        console.log(response.data);
        res.json(response.data);
    }).catch(function (error){
        console.log(error.response);
        res.send(error.response.data);
    })
    
});

router.post('/recharge', async (req, res) => {
    // const soTaiKhoan = +req.body.SoTaiKhoan || -1;
    // const soTien = +req.body.SoTien || -1;
    // if(soTaiKhoan === -1 || soTien === -1){
    //     return res.status(400).json({
    //         err: 'So tai khoan hoac so tien khong hop le'
    //     });
    // }
    console.log(privateKeyRSA);
    /*const postBody = {
        "sender_account_number": "123456789", 
        "receiver_account_number": "120204", 
        "money": 100000, 
        "type_fee": "0",   
        "message": "Gửi ăn mừng Hè 2020"

    }*/

    const postBody = req.body;

    const ts = moment().valueOf();
    const data = JSON.stringify(postBody);
    const hash = md5(ts + data + secretKey);
    const RSA = new NodeRSA(privateKeyRSA);
    const signatureRSA = RSA.sign(data, 'base64', 'base64');
    console.log(signatureRSA);
    const config = {
        headers: {
            "partnerCode": bankCode,
            "ts": ts,
            "sig": hash,
            "signature": signatureRSA
        }
    }
    
    axios.post('https://tts-bank.herokuapp.com/partner/recharge', postBody, config).then(function (response){
        console.log(response.data);
        res.json(response.data);
    }).catch(function (error){
        console.log(error.response.data);
        res.send(error.response.data);
    })
});

router.post('/addHistory', async (req, res)=>{
    const toAcc = Number(req.body.receiver_account_number);
    const fromAcc = req.body.sender_account_number;
    const moneyAmount = Number(req.body.money);
    console.log(`${fromAcc}, ${toAcc}, ${moneyAmount}`);
    const ret = await transferModel.addToHistory(fromAcc, toAcc, moneyAmount);
    const userList = await usersModel.detailByAccNumber(fromAcc);
    const email = userList[0].email;

    if(ret === null){
        return res.status(500).json("Server error");
    }

    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const html = `Dear <b>${fromAcc}</b>,
    <br/>
    This email is sent from PTBank!
    <br/><br/>
    You have transfered <b>${moneyAmount}</b> from <b>${fromAcc}</b> account number to <b>${toAcc}</b> account number at ${time}
    <br/>
    This is your OTP: <b>${ret}</b>
    <br/>
    The OTP will expire in three hours
    <br/>
    Thanks for using our service!`;

    await mailer.sendEmail('ronin32014@gmail.com', email, 'Please verify transfer OTP!', html);
    return res.json({success: true});
});

module.exports = router;