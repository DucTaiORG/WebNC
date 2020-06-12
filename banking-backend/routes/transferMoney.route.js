const express = require('express');
const transferModel = require('../models/transferMoney.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const openpgp = require('openpgp');
const crypto = require('crypto');
const config = require('../config/default.json');

const router = express.Router();
router.get('/', async (req, res) => {
    const list = await transferModel.getBalance(req.body.accNum);
    console.log(list);
    var balance = Number(list[0].balance);
    res.json(balance);
})

router.put('/update', async(req, res) => {
    const accNum = +req.body.accNum || -1;
    const moneyAmount = +req.body.moneyAmount || -1;
    if(accNum === -1 || moneyAmount === -1){
        return res.status(400).json({
            err: 'Invalid accNum or moneyAmount'
        })
    }

    const ts = +req.headers['time'] || 0;
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Expired request';
        return res.status(203).json({error});
    }

    const bankCode = await authModel.detail(req.headers['bank-code']);
    if(bankCode.length === 0){
        const error = 'Can not identify bank';
        return res.status(203).json({error});
    }

    const body = JSON.stringify(req.body);
    const headerSig = req.headers['sig'] || 0;
    const sig = crypto.createHash('sha256').update(ts + body + bankCode[0].secretKey).digest('hex');
    if(sig !== headerSig){
        const error = 'Not original request';
        return res.status(203).json({error});
    }

    const list = await transferModel.getBalance(accNum);
    if(list.length > 0){
        const balance = Number(list[0].balance);
        const publicKeyArmored = bankCode[0].publicKeyPGP;
        const sigPGP = req.headers['signature-pgp']
        if(await verifyData(publicKeyArmored, sigPGP)){
            const result = await transferModel.update(Number(moneyAmount) + balance, accNum);
            const currentTime = moment().valueOf();
            const data = moneyAmount + ', ' + accNum + ', ' + currentTime;
            console.log(data);
            const mySig = await signData(data);
            res.status(203).json({
                status: "success",
                responseSignature: mySig
            });
        }else{
            const error = "Verify fail";
            res.json({error});
        }
    }else{
        const error = 'Account number is not exist';
        return res.json({error});
    }
})

async function signData(data){
    const privateKeyArmored =  config.privatePGPArmored; // encrypted private key
    const passphrase = config.passpharse; // what the private key is encrypted with
 
    const { keys: [privateKey] } =  await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
 
    const {data: text} = await openpgp.sign({
        message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
        privateKeys: [privateKey]                             // for signing
    });
    return text;
};

async function verifyData(publicKeyArmored, sig){
    const realSignature = sig.split("\\n").join("\n");
    try {
        const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(realSignature),  // CleartextMessage or Message object
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
        });
        const { valid } = verified.signatures[0];
        
        if (valid) {
            console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = router;