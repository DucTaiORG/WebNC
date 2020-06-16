const express = require('express');
const accountModel = require('../models/account.model');
const router = express.Router();

router.get('/payment/:id', async (req, res) => {
    console.log(req.params);
    const userId = req.params.id || -1;
    const list = await accountModel.getPaymentAccountByUserId(userId);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list);
});

router.get('/saving/:id', async (req, res) => {
    console.log(req.params);
    const userId = req.params.id || -1;
    const list = await accountModel.getSavingAccountByUserId(userId);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list);
});


module.exports = router;