const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const openpgp = require('openpgp');
const config = require('../config/default.json');
const router = express.Router();

const ourPrivateKey = config.privatePGPArmored;
const partnerPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n`+
                            `Version: Keybase OpenPGP v1.0.0\n`+
                            `Comment: https://keybase.io/crypto\n\n`+
                            `xsBNBF7Jj8cBCAC8vii5BAqkdfVsx45AEiOTmU5OoIzvGKHqXy/4bt8f2DMHclcd\n`+
                            `m5U/0vqzLsSPqSqZbFj2f2/O7KLH/gpuNo57MtnBCOLegjw9CczAGhZQdlaHazaf\n`+
                            `K1vf/aEby1sHDjje9xjagcs+0OWFLNyE7+3H4nofP2Mb/GVaXH+LYSKbUFa05YLv\n`+
                            `51x2x6zmwtPoFy6r7j8ZMDqV+ASJiDQceK0cF8vsF9TkMTe770eT3EpGfMIRZgqw\n`+
                            `CrKw6JXVx+YM1aVSkIWrgdhNyoACKC4FnSIkyiQTTpYeovJRW9hWrs3SQLXm7Kcs\n`+
                            `XO0+jlSLszGA6XeT1Fge1pQHpOJ0ubMKJ0KZABEBAAHNJ0zDqiBIb8OgbmcgU2Fu\n`+
                            `ZyA8bGhzYW5naGNtdXNAZ21haWwuY29tPsLAbQQTAQoAFwUCXsmPxwIbLwMLCQcD\n`+
                            `FQoIAh4BAheAAAoJEDOb8vBxZ/JikMAH/iLljqpUk+Ge6jlmvnuRJDW853gYOMEq\n`+
                            `0YLs20g/ykSz6u7bwjKKUunfsTcZ831DsRsT8RVitvK5lgCESH5KSIWAdE1Vdj4S\n`+
                            `zKukEHnR7Dddfy9FNOUQ9cm8PaqKJ06bRJ5sSFsZTmitvi/Kq6bI3WbyWKBULHnh\n`+
                            `uc6MdCN5bECvgGV4hjwnFdHfm6rSw4zPfjjYfoOjkFgKh2EEc21WZY8/BAHHYox3\n`+
                            `KjTZ7xlqA/8jL8yFNWUTHNIj4rbZ+B+v0pTRSx//UJzP+vCiPUjuQ2cfjrGr1bXG\n`+
                            `G53ZwcP19FUc13rYCxc0B8x3oe1saIa3x69zWkYdYU/o97Fat1ori5fOwE0EXsmP\n`+
                            `xwEIAL7Zab3zJmQRwz3w/TX6Iq/2/ctECoiORfpd2jAHM7Jpxj3/wFS/gMSXqCHL\n`+
                            `nkVuHXIe5qTsT28agRDPgqlFW4E5DM2Xg/34PGCCUv6V62H5JvE2wMOPVII3AX/k\n`+
                            `6MFGeFaaf38Z/VNSywSD1mSPuXBUI5IcZjlKmUvsmOvKcMj565Gz+3zVTKHnDVHN\n`+
                            `p2uwzDbISpAQyJbjCN3Pccw3OPMu3pS4NhQdd8rBN09iFaVeFPPzymUC8f2VlVy2\n`+
                            `qZXfCoqLUPg75Msp9eTXHp04S8Xxs3H2w30Tc1bbTxYWoR0jpn8m1v2HHrkdraJd\n`+
                            `LXqFYaQuEcEScxc2ypCznBIg8t0AEQEAAcLBhAQYAQoADwUCXsmPxwUJDwmcAAIb\n`+
                            `LgEpCRAzm/LwcWfyYsBdIAQZAQoABgUCXsmPxwAKCRC8EwaMESMWSlJ9B/4zNF7j\n`+
                            `eEP1heKtnIDtC378B0phR1M9xYM5DTmV0Y16qhtTz93dBuetp071mulz4OJxxLa9\n`+
                            `ntDpXthds472w0aPB1C0MyU+ZVUd4fe0OOKjmqthBLL4og4I+EKILkSS5bTxpg/a\n`+
                            `RPsd8la6SEiDdQaMcB/HJPPlaBD34tVR5Vk0s+KQKJi1HGRP8qusgo5O6RtAB/F8\n`+
                            `PyexqCwwCstFw5ZWfA95/QKGz3o7PuBpd1TLHnxPSBLdbUm2r1vREIFdbjPHDPUb\n`+
                            `cp9zwMhy642w296/CwJF7Uff/wTFXvlJH7mIMUOW3ZXriXKexHVg/2EnwqsNnJEh\n`+
                            `nn5hJPvgjW5XPNyKXOAH/j3i2YbmrQCeuaK66Y8JLiL2DjSj86FZmo6Qj0RznzWj\n`+
                            `bgX9BrjcmTIm7oxhGUbo15uruKu10fyZh+2HbeuCL47xU6uMb3yC1HQ/VXL0jjON\n`+
                            `RD2BD0y6kGyFYuGQd2Pv43i+ONemuqMmg4gHQYtwFiwXGKlzf7kHG8UdEf/+JQD+\n`+
                            `PgvlJZDOf78uiWFjY5fAG4GWqE0Xor9vwyb+Jvwh7UK4CKPuQfGhN75gj/G5i4Vd\n`+
                            `KDPMRvsTOq1Dqxum7uu9ggiiVq6Mi09CeMNu+58u5A64iPNUcW9YqBpTGJlBah29\n`+
                            `KxobadMa2KPB4O7d5qqJYmAn9WCJS6oYv867Lajcbq/OwE0EXsmPxwEIANfKKjFG\n`+
                            `uT6boZy8Q90RuiEnNaq6U8VYSO+rP8p1L/bkruHP34Viu/FcFnmVShZgi6Ue69+r\n`+
                            `WkRYljSmBlvGs6PhWK8pOIT8qDFg4IiE8OheCcOQpOgSWpDPmtyi3CHl5UgF2kD1\n`+
                            `kG25EQmrZYYaF6w/v4GKZQ7UY+39ez1vXspwFw+FMvIDI8u7o+HzJqJWvu5YfFNe\n`+
                            `irw91Kz9BhwVlMtrGI06ji59rseccBIzQfNcttQzQMFK+eNLg0WW4idForObGAVN\n`+
                            `o5sUQXE6xh5ULr0Q2yxdmvEngK2dPU/8S9cBmJ58x7vpLU5fuTHDUpL1JkMcNylu\n`+
                            `v40MHyTOOzUjJksAEQEAAcLBhAQYAQoADwUCXsmPxwUJDwmcAAIbLgEpCRAzm/Lw\n`+
                            `cWfyYsBdIAQZAQoABgUCXsmPxwAKCRDUddLs2GedBg7iB/9JXerc90doE2VlUNBB\n`+
                            `oonneSETI/AtWglP4y4jd7a+05f8KD3djFBL+DRvGarMiHU310hbQnRjyLmOJNNb\n`+
                            `tBBEQ0X4kpmA8WwrQ83RfHapXXfCy0OHS81b46rrIGTXiCw2hBCfcRVZ5Np7Nf5G\n`+
                            `UlVDae1GXECIsIcIAbgq/y/dhQzoxNU0YwHp+wMx+Rvxp1FI6qXm3iE+XIh2+GaY\n`+
                            `AI+ZGYPDkaotoqGLYUQF4K2xzOVbmO7roMJD5kUnLMALsATRBpWcpp5rhKbPqRZy\n`+
                            `gVKSZFKkKmM9+3jKCZw+YltFEE0X9N4b1gfgb8/oC7c/q/dmHjUIyWrnbKoQYuJr\n`+
                            `te49iNkIAJxUSxMbeyemfb11rRJZspwBT7qfa1Osc7SQdLTR+MwhiM/AfA7Q86Kv\n`+
                            `g4r5exkS/wG4FdKRJdB+mubRJr4b2vDVzwAcjTN1CzbNtiTLrpLJZN2C/ZC/nkY6\n`+
                            `M/rGv8mA/6cxHgjGhx7/HmW6N+S10WIog4rUHQpTQ4vZHexCFxrRKzN4HDArZbu+\n`+
                            `WmCFnfTAqRyDuEjXojyJb0BeXu31PFVliCZ0ag74wo29PK0t5bGCzc/sKeh1bKZH\n`+
                            `HTncQqSlzHC0qDT09vOvVTv8zzmQsAit4bG6ixt2t8oCLmhV3aaQiu5Ko0cwdA7e\n`+
                            `aWsFa5FTZM6nd8ohBThLdSvOoFxip5w=\n`+
                            `=zEGz\n`+
                            `-----END PGP PUBLIC KEY BLOCK-----`;


const partner_code = "partner34";
const secret_key = "nhom34banking";
const passphrase = config.passpharse;

router.get('/tracuu/:stk', async (req, res) =>{
    const accountId = req.params.stk || -1;
    if(accountId === -1){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }
    const accountIdHashed = crypto.createHmac('SHA1',secret_key).update(accountId).digest('hex');
    let { data: accountIdEncrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(accountId),
        publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys 
    });
    
    accountIdEncrypted = accountIdEncrypted.replace(/\r/g,"\\n").replace(/\n/g,"")

    const currentTime =  Math.round((new Date()).getTime() / 1000)
    const entryTimeHashed = crypto.createHmac('SHA1',secret_key).update(currentTime.toString()).digest('hex')

    let { data: entryTimeEncrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(currentTime.toString()),
        publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys 
    });

    entryTimeEncrypted = entryTimeEncrypted.replace(/\r/g,"\\n").replace(/\n/g,"");

    const { keys: [privateKey] } = await openpgp.key.readArmored(ourPrivateKey);
	await privateKey.decrypt(passphrase);

    let { data: digitalSignature } = await openpgp.sign({
        message: openpgp.cleartext.fromText(accountId), // CleartextMessage or Message object
        privateKeys: [privateKey]                             // for signing
    });

    digitalSignature = digitalSignature.replace(/\r/g,"\\n").replace(/\n/g,"");
    
    let instance = axios.create({
        baseURL: 'http://35.198.211.163/transactions/receiver-interbank',
        timeout: 5000,
        headers: {
            'x_partner_code': partner_code,
            'x_signature': digitalSignature,
            'x_account_id_hashed':accountIdHashed,
            'x_account_id_encrypted':accountIdEncrypted,
            'x_entry_time_encrypted': entryTimeEncrypted,
            'x_entry_time_hashed':entryTimeHashed
        }
    })

    instance.interceptors.request.use(
        config => {
            config.headers.x_access_token = partner_code
            config.headers.x_signature = digitalSignature
            config.headers.x_account_id_hashed = accountIdHashed
            config.headers.x_account_id_encrypted = accountIdEncrypted
            config.headers.x_entry_time_encrypted = entryTimeEncrypted
            config.headers.x_entry_time_hashed = entryTimeHashed
            return config
        },
        error => {
            console.log("error ne", error)
            return Promise.reject(error)
        }
    )
    
    
    instance.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        return Promise.resolve({ error });
    });

    const response = await instance({
        method:'get',
        url:''
    })

    if (response && !response.error) {
        res.status(200).json(response.data)
    } else {
        if (response && response.error && response.error.response && response.error.response.status) {
            res.status(response.error.response.status).json(response.error.response.data)
        }
    }
})

router.post('/naptien',async function (req,res) {
        
    let {
        toAccountId,
        toFullName,
        fromAccountId,
        fromFullName,
        fromBankId,
        transactionAmount
    } = req.body

    let entryTime =  Math.round((new Date()).getTime() / 1000);
    req.body.entryTime = entryTime;

    const data_hashed = crypto.createHmac('SHA1',secret_key).update(JSON.stringify({
        toAccountId,
        toFullName,
        fromAccountId,
        fromFullName,
        fromBankId,
        transactionAmount,
        entryTime
    })).digest('hex');

    const { keys: [privateKey] } = await openpgp.key.readArmored(ourPrivateKey);
    await privateKey.decrypt(passphrase);

    let { data: digital_sign } = await openpgp.sign({
        message: openpgp.cleartext.fromText(JSON.stringify(req.body)), // CleartextMessage or Message object
        privateKeys: [privateKey]                             // for signing
    });

    digital_sign = digital_sign.substring(digital_sign.indexOf('-----BEGIN PGP SIGNATURE-----'),digital_sign.length);
    digital_sign = digital_sign.replace(/\r/g,"\\n").replace(/\n/g,"");

    const { data: bodyData } = await openpgp.encrypt({
    	message: openpgp.message.fromText(JSON.stringify(req.body)),
    	publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys 
    });

    let data = {
        data: bodyData,
        digital_sign,
        data_hashed
    }

    let instance = axios.create({
        baseURL: 'http://35.198.211.163/transactions/receiving-interbank',
        timeout: 5000
    });

    instance.interceptors.request.use(
        config => {
            config.headers.x_partner_code = partner_code
            return config
        },
        error => {
            console.log("error ne", error)
            return Promise.reject(error)
        }
    );
    
    
    instance.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        return Promise.resolve({ error });
    });

    const response = await instance({
        method:'post',
        url:'',
        data
    });

    if (response && !response.error) {
        res.status(200).json(response.data)
    } else {
        if (response && response.error && response.error.response && response.error.response.status) {
            res.status(response.error.response.status).json(response.error.response.data)
        }
    }
})

module.exports = router;