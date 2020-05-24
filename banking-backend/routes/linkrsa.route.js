const express = require('express');
const crypto = require('crypto');
const configDefalut = require('../config/default.json');
const moment = require('moment');
const axios = require('axios');

const router = express.Router();

router.get('/tracuu/:stk', async (req, res)=>{
    const soTaiKhoan = +req.params.stk || -1
    if(soTaiKhoan === -1){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }

    const bankCode = configDefalut.secretKey;
    const ts = moment().valueOf();
    const hash = crypto.createHash('sha256').update(ts + "NganHangB").digest('hex');
    const config = {
        headers: {
            "bank-code": bankCode,
            "time": ts,
            "sig": hash
        }
    }
    console.log(config);
    
    axios.get('https://nhom34bank.herokuapp.com/api/taikhoan/' + soTaiKhoan, config).then(function (response){
        console.log(response.data);
        res.json(response.data);
    }).catch(function (error){
        console.log(error.response);
        res.send(error.response.data);
    })
    
})

module.exports = router;