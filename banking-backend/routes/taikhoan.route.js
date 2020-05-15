const express = require('express');
const taiKhoanModel = require('../models/taikhoan.model');
const authModel = require('../models/auth.model');

const router = express.Router();

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

    const code = await authModel.detail(req.header('bankCode'));
    if(code.length === 0){
        return res.json({error: "Ngan hang chua lien ket"});
    }
    const list = await taiKhoanModel.detail(id);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
})

module.exports = router;