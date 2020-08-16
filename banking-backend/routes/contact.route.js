const express = require('express');
const userModel = require('../models/users.model');
const db = require('../utils/db');
const { route } = require('./users.external.route');
const router = express.Router();

router.post('/:id/add', async (req, res) => {
    const listPaymentAccount = await userModel.getAllPaymentAccount(req.body.accountNumber);
    console.log(listPaymentAccount.length + "");
    if(listPaymentAccount.length === 0){
        console.log("Account not existed");
        return res.status(203).end();
    } else{
        const addToReceiveAccount = await userModel.addToReceiveAccount(req.body.accountNumber, req.body.rememberName);
        const loadContact = await userModel.loadContactWithAccountNumber(req.body.accountNumber);
        const addContact = await userModel.addContact(req.params.id, loadContact[0].id);
        if(addContact == null){
            console.log("Contact already existed");
            return res.status(204).end();
        } else{
            return res.json(addContact);
        }
    }
});

router.get('/:id', async(req, res) => {
    const result = await userModel.showUserContact(req.params.id);
    return res.json(result);
});

router.post('/:id/delete', async(req, res) => {
    const deleteUsersAddUsers = await userModel.deleteUsersAddUsers(req.params.id, req.body.receiveUserID);
    const result = await userModel.deleteContact(req.body.receiveUserID);
    return res.json(result);
});

router.post('/update/:id', async(req, res) => {
    const result = await userModel.updateContact(req.body.accountNumber, req.body.rememberName, req.params.id);
    return res.json(result);
});

router.get('/detail/:id', async (req, res) => {
    const result = await userModel.showDetailContact(req.params.id);
    res.json(result);
});

module.exports = router;