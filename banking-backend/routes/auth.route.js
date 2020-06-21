const express = require('express');
const router = express.Router();
const authModel = require('../models/auth.model');
const userModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const randToken = require('rand-token');
const createError = require('http-errors');


//Login api 
router.post('/login', async (req, res)=>{
    console.log(req.body);
    const ret = await authModel.login(req.body);
    if(ret === null){
        return res.json({
            authenticated: false
        })
    }

    const accessToken = generateAccessToken(ret.id);
    const refreshToken = randToken.generate(80);
    const userRole = ret.userRole;
    const userId = ret.id;
    await userModel.updateRefreshToken(ret.id, refreshToken);
    res.json({
        authenticated: true,
        userId,
        userRole,
        accessToken,
        refreshToken
    });
});

//api reset refresh token
router.post('/refresh', (req, res, next) => {
    jwt.verify(req.body.accessToken, config.secretKey, {ignoreExpiration: true}, async function(err, payload){
        if(err){
            next(createError(401, err));
            return;
        }
        
        const { userId } = payload;
        const ret = await userModel.verifyRefreshToken(userId, req.body.refreshToken);
        if(ret === true){
            const accessToken = generateAccessToken(userId);
            return res.json({accessToken});
        }

        next(createError(401, 'Invalid refresh token'));
    });
});

const generateAccessToken = userId => {
    const payload = { userId };

    const accessToken = jwt.sign(payload, config.secretKey, {
        expiresIn: '10m'
    });

    return accessToken;
}

module.exports = router;