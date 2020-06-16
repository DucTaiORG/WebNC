const express = require('express');
const userModel = require('../models/users.model');
const router = express.Router();

router.get('/byAccountNum/:accNum', async (req, res) => {
    if(isNaN(req.params.accNum)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const accNum = req.params.accNum || -1;
    const list = await userModel.detailByAccNumber(accNum);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
});

router.get('/byUserId/:id', async (req, res)=>{
    if(isNaN(req.params.id)){
        return res.status(400).json({
            err: 'Invalid params'
        });
    }
    const id = req.params.id || -1;
    const list = await userModel.detailBalanceByUserId(id);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
});


module.exports = router;