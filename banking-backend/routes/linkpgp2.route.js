const express = require('express');
const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const openpgp = require('openpgp');
const config = require('../config/default.json');
const router = express.Router();
router.post('/check', async (req, res)=>{
    const ts = moment().valueOf();
    const body = {
        "account_number": 53210000591138,
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

    console.log(encryptedBody);

    axios.post('13.250.20.250:9807/api/account/info', encryptedBody, configHeader).then(function (response){
        console.log(`response: ${JSON.stringify(response)}`);
        res.json(response.data);
    }).catch(function (error){
        console.log(`error: ${JSON.stringify(error)}`);
        res.send(error.response);
    })
});

router.post('/recharge', async (req, res)=>{
    const ts = moment().valueOf();
    const body = {
        "account_number": 53210000591138,
        "request_time": ts,
        "amount": 50000
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

    axios.post('13.250.20.250:9807/api/account/recharge', encryptedBody, configHeader).then(function (response){
        console.log(response);
        res.json(response.data);
    }).catch(function (error){
        console.log(error.response);
        res.send(error.response);
    })

});

module.exports = router;