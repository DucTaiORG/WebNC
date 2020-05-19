const express = require('express');
const nopTienModel = require('../models/noptien.model');
const taiKhoanModel = require('../models/taikhoan.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');

const router = express.Router();

const secretKey = "NganHangB";
router.get('/', async (req, res) => {
    const list = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    console.log(list);
    var sodu = Number(list[0].SoDu);
    res.json(sodu);
})

router.put('/update', async(req, res) => {
    console.log(req.body.SoDu);
    const listTaiKhoan = await nopTienModel.getSoDu(req.body.SoTaiKhoan);
    var sodu = Number(listTaiKhoan[0].SoDu);
    if(isNaN(req.body.SoTaiKhoan)){
        return res.status(400).json({
            err: 'Invalid STK'
        });
    }
    
    const result = await nopTienModel.update(Number(req.body.SoDu) + sodu, req.body.SoTaiKhoan);
    const id = +req.params.id || -1;
    
    const ts = +req.headers['time'] || 0;
    const currentTime = moment().valueOf();
    const expireTime = 600000; // 10 mins

    if(currentTime - ts > expireTime){
        const error = 'Loi goi da qua han';
        return res.json({error});
    }

    const headerSig = req.headers['sig'] || 0;
    const sig = crypto.createHash('sha256').update(ts + secretKey).digest('hex');
    if(sig !== headerSig){
        const error = 'Goi tin da bi chinh sua';
        return res.json({error});
    }

    const code = await authModel.detail(req.headers['bank-code']);
    if(code.length === 0){
        const error = 'Ngan hang chua lien ket';
        return res.json({error});
    }
    const list = await taiKhoanModel.detail(id);
    if(list.length === 0){
        return res.status(201).json(result);;
    }
    res.json(list[0]);
    
})

module.exports = router;