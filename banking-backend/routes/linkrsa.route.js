const express = require('express');
const crypto = require('crypto');
const configDefalut = require('../config/default.json');
const moment = require('moment');
const axios = require('axios');

const router = express.Router();

const bankCode = configDefalut.bankCode;
const secretKey = configDefalut.secretKey;
const privateKeyRSA = configDefalut.privateRSA;
router.get('/tracuu/:stk', async (req, res)=>{
    const soTaiKhoan = +req.params.stk || -1
    if(soTaiKhoan === -1){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }

    const ts = moment().unix();
    const hash = crypto.createHash('sha256').update(ts + secretKey).digest('hex');
    const config = {
        headers: {
            "X-BANK": bankCode,
            "X-TIME": ts,
            "X-HASH": hash
        }
    }
    axios.get('https://bankapp19.herokuapp.com/api/accounts/' + soTaiKhoan, config).then(function (response){
        console.log(response.data);
        res.json(response.data);
    }).catch(function (error){
        console.log(error.response);
        res.send(error.response.data);
    })
    
})

router.post('/naptien', async (req, res) => {
    const soTaiKhoan = +req.body.SoTaiKhoan || -1;
    const soTien = +req.body.SoTien || -1;
    if(soTaiKhoan === -1 || soTien === -1){
        return res.status(400).json({
            err: 'So tai khoan hoac so tien khong hop le'
        });
    }
    console.log(JSON.stringify(req.body));

    const postBody = {
        sendId: 123456789,
        receivedId: soTaiKhoan,
        amount: soTien
    }

    const ts = moment().unix();
    const data = JSON.stringify(postBody);
    const sign = crypto.createSign('SHA256');
    sign.update(ts + data);
    const signature = sign.sign(privateKeyRSA, 'hex');
    console.log(signature);
    const config = {
        headers: {
            "X-BANK": bankCode,
            "X-TIME": ts,
            "X-SIGN": signature
        }
    }
    console.log(config);
    
    axios.post('https://bankapp19.herokuapp.com/api/transfers', postBody, config).then(function (response){
        console.log(response.data);
        res.json(response.data);
    }).catch(function (error){
        res.send(error.response.data);
    })
})

module.exports = router;