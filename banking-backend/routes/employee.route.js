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
    list.forEach(element => {
        element.dateOfBirth = moment(element.dateOfBirth).format('DD/MM/YYYY'); 
     });
    return res.status(200).json(list);
});

router.get('/:id', async (req, res) => {
    const empId = req.params.id || -1;
    const result = await employeeModel.singleByUserId(empId);
    if(result.length === 0){
        return res.status(204).end();
    };
    result[0].dateOfBirth = moment(result[0].dateOfBirth).format('YYYY-MM-DD');
    return res.json(result[0]);
});

router.post('/update', async (req, res)=>{
    console.log(req.body);
    const result = await employeeModel.update(req.body);
    if(result.affectedRows === 0){
        return res.status(400).json({error: 'Can not update'});
    }
    return res.json(result);
});

router.get('/delete/:id', async (req,res)=>{
    const empId = req.params.id || -1;
    const result = await employeeModel.delete(empId);

    if(result.affectedRows === 0){
        return res.status(400).json({error: 'Can not delete'});
    }

    return res.json(result);
})

module.exports = router;