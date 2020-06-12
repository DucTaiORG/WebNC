const express = require('express');
const userModel = require('../models/users.model');
const router = express.Router();

router.get('/:id', async (req, res) => {
    if(isNaN(req.params.id)){
        return res.status(400).json({
            err: 'Invalid Id'
        });
    }
    const id = +req.params.id || -1;
    const list = await userModel.detailByUserId(id);
    if(list.length === 0){
        return res.status(204).end();
    }
    res.json(list[0]);
})


module.exports = router;