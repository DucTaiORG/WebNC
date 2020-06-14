const express = require('express');
const router = express.Router();
const userModel = require('../models/users.model');
const employeeModel = require('../models/employee.model');
const moment = require('moment');

router.post('/register', async (req, res)=>{
    console.log(req.body);
    const rows = await userModel.singleByUserName(req.body.username);
    if(rows.length){
        return res.status(400).json({error: 'Username exist'});
    }
    const result = await userModel.add(req.body);
    const ret = {
        id: result.insertId,
        ...req.body
    }

    delete ret.password;
    return res.status(201).json(ret); 
});

router.get('/all', async (req, res)=>{
    const list = await employeeModel.all();
    console.log(list);
    list.forEach(element => {
        element.dateOfBirth = moment(element.dateOfBirth).format('DD/MM/YYYY'); 
     });
    return res.status(200).json(list);
})

module.exports = router;