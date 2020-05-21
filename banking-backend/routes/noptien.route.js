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
    
    const publicKeyArmored = bankCode[0].code;
    if(verifyData(req.body.SigData, publicKeyArmored)){
        const result = await nopTienModel.update(Number(req.body.SoDu) + sodu, req.body.SoTaiKhoan);
        res.status(201).json(result);
    }else{
        const error = "Verify that bai";
        res.json({error});
    }
})

async function signData(data){
    const privateKeyArmored =  config.privatePGPArmored; // encrypted private key

    //const publicKeyArmored = config.publicPGPArmored;
    const passphrase = config.passpharse; // what the private key is encrypted with
 
    const { keys: [privateKey] } =  await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
 
    const { data: cleartext } = await openpgp.sign({
        message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
        privateKeys: [privateKey]                             // for signing
    });
    console.log(cleartext); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
};

async function verifyData(publicKeyArmored, data){
    const verified = await openpgp.verify({
        message: await openpgp.cleartext.readArmored(data),           // parse armored message
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
    });
    const { valid } = verified.signatures[0];
    if (valid) {
        console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
        return true;
    } else {
        throw new Error('signature could not be verified');
    }
}

module.exports = router;