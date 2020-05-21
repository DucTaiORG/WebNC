const express = require('express');
const taiKhoanModel = require('../models/taikhoan.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');

const router = express.Router();

const secretKey = "NganHangB";
router.get('/', async (req, res) => {
    const list = await taiKhoanModel.all();
    console.log(list);
    res.json(list);
})

router.get('/:id', async (req, res) => {
    if(isNaN(req.params.id)){
        return res.status(400).json({
            err: 'Invalid Id'
        });
    }
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
        return res.status(204).end();
    }
    res.json(list[0]);
})

module.exports = router;