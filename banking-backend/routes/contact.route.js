const express = require('express');
const userModel = require('../models/users.model');
const db = require('../utils/db');
const router = express.Router();

router.post('/add', async (req, res) => {
    console.log(req.body);
    const result = await userModel.addContact(req.body.accountNumber, req.body.rememberName);
    
    return res.json(result);
});


module.exports = router;