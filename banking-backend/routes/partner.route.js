const express = require('express');
const partnerModel = require('../models/partner.model');
const router = express.Router();
const moment = require('moment');

router.get('/allHistory', async (req, res) =>{
    const ret = await partnerModel.getAllHistory();
    ret.forEach(element => {
        element.transfer_time = moment(element.transfer_time).format('HH:mm:ss DD/MM/YYYY'); 
    });

    return res.json(ret);
});

router.get('/allBank', async (req, res)=>{
    const ret = await partnerModel.allBank();
    return res.json(ret);
});

router.get('/history/:id', async (req,res)=>{
    const partnerId = req.params.id || -1;
    const list = await partnerModel.getHistoryByPartnerId(partnerId);
    list.forEach(element => {
        element.transfer_time = moment(element.transfer_time).format('HH:mm:ss DD/MM/YYYY'); 
    });

    return res.json(list);
})

router.post('/filteredDate', async(req, res) => {
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    const ret = await partnerModel.getFilteredDate(startDate, endDate)
    ret.forEach(element => {
        element.transfer_time = moment(element.transfer_time).format('HH:mm:ss DD/MM/YYYY'); 
    });
    return res.json(ret)
})

module.exports = router;