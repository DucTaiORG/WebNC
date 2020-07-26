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

router.post('/update', async(req, res) => {
    console.log('transfer body: ' + JSON.stringify(req.body));
    const accNum = +req.body.accNum || -1;
    const moneyAmount = +req.body.moneyAmount || -1;
    if(accNum === -1 || moneyAmount === -1){
        return res.status(400).json({
            err: 'Invalid accNum or moneyAmount'
        })
    }

    const ts = +req.headers['x-time'] || 0;
    console.log('time: ' + ts);
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Expired request';
        return res.status(203).json({error});
    }

    const bank = await authModel.detail(req.headers['x-partner-code']);
    if(bank.length === 0){
        const error = 'Can not identify bank';
        console.log('Response: ' + error);
        return res.status(203).json({error});
    }

    const body = JSON.stringify(req.body);
    const headerHash = req.headers['x-hash'] || 0;
    console.log('hash: ' + headerHash);
    
    const hash = crypto.createHash('sha256').update(ts + body + bank[0].secretKey).digest('hex');
    
    if(hash !== headerHash){
        const error = 'Not original request';
        console.log('Response: ' + error);
        return res.status(203).json({error});
    }

    const list = await transferModel.getBalance(accNum);
    if(list.length > 0){
        const balance = Number(list[0].balance);
        const publicKeyArmored = bank[0].publicKey;
        const sigPGP = req.headers['x-signature-pgp'];
        console.log('signature-pgp: ' + JSON.stringify(sigPGP));
        if(await verifyData(publicKeyArmored, sigPGP)){
            const result = await transferModel.update(Number(moneyAmount) + balance, accNum);
            const currentTime = moment().valueOf();
            const data = moneyAmount + ', ' + accNum + ', ' + currentTime;
            console.log(data);
            const mySig = await signData(data);
            const partnerId = bank[0].id;
            const tranferTime = moment(ts).format('YYYY-MM-DD HH:mm:ss');
            await transferModel.addToHistory(partnerId, moneyAmount, tranferTime, sigPGP);//Add to history
            console.log("response: success");
            return res.json({
                status: "success",
                responseSignature: mySig
            });
        }else{
            const error = "Verify fail";
            console.log('Response: ' + error);
            
            return res.json({error});
        }
    }else{
        const error = 'Account number is not exist';
        console.log('Response: ' + error);
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
    const realpublicKey = publicKeyArmored.split("\\n").join("\n");
    console.log(`public key: `);
    console.log(realpublicKey);
    const realSignature = sig.split("\\n").join("\n");
    console.log(`signature: `);
    console.log(realSignature);
    
    try {
        const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(realSignature),  // CleartextMessage or Message object
            publicKeys: (await openpgp.key.readArmored(realpublicKey)).keys // for verification
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