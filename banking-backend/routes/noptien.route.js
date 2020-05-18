const express = require('express');
const nopTienModel = require('../models/noptien.model');
const authModel = require('../models/auth.model');
const moment = require('moment');
const crypto = require('crypto');

const router = express.Router();

const secretKey = "NganHangB";
router.get('/', async (req, res) => {
    const list = await nopTienModel.all();
    console.log(list);
    res.json(list);
})

router.put('/update', async(req, res) => {
    const result = await nopTienModel.update(req.body[SoDu], req.body[SoTaiKhoan]);
    res.status(201).json(result);
})

module.exports = router;