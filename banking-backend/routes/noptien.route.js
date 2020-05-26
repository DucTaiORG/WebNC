const express = require('express');
const nopTienModel = require('../models/noptien.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const openpgp = require('openpgp');
const crypto = require('crypto');
const config = require('../config/default.json');

const router = express.Router();
router.get('/', async (req, res) => {
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    console.log(list);
    var sodu = Number(list[0].SoDu);
    res.json(sodu);
})

router.put('/update', async(req, res) => {
    const soTaiKhoan = +req.body.SoTaiKhoan || -1;
    const soTien = +req.body.SoTien || -1;
    if(soTaiKhoan === -1 || soTien === -1){
        return res.status(400).json({
            err: 'So tai khoan hoac so tien khong hop le'
        })
    }

    const ts = +req.headers['time'] || 0;
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Loi goi da qua han';
        return res.status(203).json({error});
    }

    const bankCode = await authModel.detail(req.headers['bank-code']);
    if(bankCode.length === 0){
        const error = 'Ngan hang chua lien ket';
        return res.status(203).json({error});
    }

    const body = JSON.stringify(req.body);
    const headerSig = req.headers['sig'] || 0;
    const sig = crypto.createHash('sha256').update(ts + body + bankCode[0].secretKey).digest('hex');
    if(sig !== headerSig){
        const error = 'Goi tin da bi chinh sua';
        return res.status(203).json({error});
    }

    const list = await nopTienModel.getSoDu(soTaiKhoan);
    if(list.length > 0){
        const sodu = Number(list[0].SoDu);
        const publicKeyArmored = bankCode[0].publicKeyPGP;
        const sigPGP = req.headers['signature-pgp']
        if(await verifyData(publicKeyArmored, sigPGP)){
            const result = await nopTienModel.update(Number(soTien) + sodu, soTaiKhoan);
            const currentTime = moment().valueOf();
            const data = soTien + ', ' + soTaiKhoan + ', ' + currentTime;
            console.log(data);
            const mySig = await signData(data);
            res.status(203).json({
                status: "success",
                responseSignature: mySig
            });
        }else{
            const error = "Verify that bai";
            res.json({error});
        }
    }else{
        const error = 'Khong ton tai so tai khoan';
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