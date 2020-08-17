const express = require('express');
const moment = require('moment');
const axios = require('axios');
const openpgp = require('openpgp');
const usersModel = require('../models/users.model');
const config = require('../config/default.json');
const router = express.Router();
router.post('/check', async (req, res)=>{
    const ts = moment().valueOf();
    const body = {
        "account_number": +req.body.toAccount || -1,
        "request_time": ts
    }

    const { keys: [privateKey] } = await openpgp.key.readArmored(config.privatePGPArmored);
    await privateKey.decrypt(config.passpharse);

    let { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(JSON.stringify(body)),
        publicKeys: (await openpgp.key.readArmored(config.partnerPGPPublicKey)).keys,
        privateKeys: [privateKey]
    });

    const configHeader = {
        headers: {
            "Partner-Code": config.bankCode
        }
    };

    const encryptedBody = {
        message: encrypted
    };

    axios.post('https://internet-banking-30.herokuapp.com/api/account/info', encryptedBody, configHeader).then((response)=>{
        console.log(response);
        res.json(response.data);
    }).catch((error)=>{
        console.log(error);
        res.send(error.response);
    })
});

router.post('/recharge', async (req, res)=>{
    const ts = moment().valueOf();
    const accountNumber = +req.body.toAccount || -1;
    const moneyAmount = +req.body.moneyAmount || 0;
    const sender = +req.body.sender || 0;
    const otpNumber = +req.body.otpNum || 10;
    const body = {
        "account_number": accountNumber,
        "request_time": ts,
        "amount": moneyAmount
    }

    const { keys: [privateKey] } = await openpgp.key.readArmored(config.privatePGPArmored);
    await privateKey.decrypt(config.passpharse);

    let { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(JSON.stringify(body)),
        publicKeys: (await openpgp.key.readArmored(config.partnerPGPPublicKey)).keys,
        privateKeys: [privateKey]
    });

    const configHeader = {
        headers: {
            "partner-Code": config.bankCode
        }
    };

    const encryptedBody = {
        message: encrypted
    };

    axios.post('https://internet-banking-30.herokuapp.com/api/account/recharge', encryptedBody, configHeader).then(async (response)=>{
        console.log(response);
        await usersModel.subtractMoney(sender, moneyAmount, otpNumber);
        res.json(response.data);
    }).catch((error)=>{
        console.log(error);
        res.send(error.response);
    })

});

module.exports = router;