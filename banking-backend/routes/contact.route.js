const express = require('express');
const userModel = require('../models/users.model');
const db = require('../utils/db');
const router = express.Router();

router.post('/:id/add', async (req, res) => {
    const addToReceiveAccount = await userModel.addToReceiveAccount(req.body.accountNumber, req.body.rememberName);
    const loadContact = await userModel.loadContactWithAccountNumber(req.body.accountNumber);
    const addContact = await userModel.addContact(req.params.id, loadContact[0].id);
    return res.json(addContact);
});

router.get('/:id', async(req, res) => {
    const result = await userModel.showUserContact(req.params.id);
    return res.json(result);
})


module.exports = router;