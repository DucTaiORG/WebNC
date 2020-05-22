const express = require('express');
const nopTienModel = require('../models/noptien.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const openpgp = require('openpgp');

const router = express.Router();
router.get('/', async (req, res) => {
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    console.log(list);
    var sodu = Number(list[0].SoDu);
    res.json(sodu);
})

router.put('/update', async(req, res) => {
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    var sodu = Number(list[0].SoDu);
    if(isNaN(req.body.SoTaiKhoan)){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }

    const bankCode = await authModel.detail(req.headers['bank-code']);
    if(bankCode.length === 0){
        const error = 'Ngan hang chua lien ket';
        return res.json({error});
    }
    
    const publicKeyArmored = bankCode[0].publicKeyPGP;
    const sigPGP = req.headers['signature-pgp']
    
    if(await verifyData(publicKeyArmored, sigPGP)){
        const result = await nopTienModel.update(Number(req.body.SoTien) + sodu, req.body.SoTaiKhoan);
        const currentTime = moment().valueOf();
        const data = req.body.SoTien + ', ' + req.body.SoTaiKhoan + ', ' + currentTime;
        const mySig = await signData(data);
        res.status(201).json(mySig);
    }else{
        const error = "Verify that bai";
        res.json({error});
    }
})

async function signData(data){
    const privateKeyArmored =  config.privatePGPArmored; // encrypted private key
    const passphrase = config.passpharse; // what the private key is encrypted with
 
    const { keys: [privateKey] } =  await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
 
    const {signature} = await openpgp.sign({
        message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
        privateKeys: [privateKey],                            // for signing
        detached: true
    });
    console.log(signature);
};

async function verifyData(publicKeyArmored, sig){
    const realSignature = sig.split("\\n").join("\n");
    console.log(realSignature);
    const realPubKeyArmored = publicKeyArmored.split("\\n").join("\n");
    try {
        const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(realSignature),  // CleartextMessage or Message object
            publicKeys: (await openpgp.key.readArmored(realPubKeyArmored)).keys // for verification
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