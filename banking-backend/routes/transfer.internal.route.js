const express = require('express');
const router = express.Router();
const transferModel = require('../models/transfer.model');

router.post('/', async (req, res)=>{
    const toAcc = req.body.toAcc;
    const fromAcc = req.body.fromAcc;
    const moneyAmount = req.body.moneyAmount;
    const feeType = req.body.transferFeeType;
    const ret = await transferModel.transfer(fromAcc, toAcc, moneyAmount, feeType);

    if(ret == null || ret == 2){
        return res.status(400).json({error: "Can not transfer"});
    }

    if(ret == 1){
        return res.status(500).json({error: "Can not transfer"});
    }

    return res.json({success: true});
});

module.exports = router;