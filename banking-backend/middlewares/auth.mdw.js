const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const userModel = require('../models/users.model');
const config = require('../config/default.json');

module.exports = {
    verify: (req, res, next) => {
        const token = req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.secretKey, function(err, payload){
                if(err){
                    throw createError(401, err);
                }
                    
                next();
            });
        }else{
            throw createError(401, 'No access token.');
        }
    },

    verifyEmployee: async (req, res, next) => {
        const token = req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.secretKey, async function(err, payload){
                if(err){
                    throw createError(401, err);
                }

                const {userId} = payload;
                const rows = await userModel.singleByUserId(userId);
                console.log(rows);
                
                const userRole = rows[0].userRole;
                if(userRole !== 2){
                    throw createError(401, 'Do not allow to access resource');
                }
                next();
            });
        }else{
            throw createError(401, 'No access token.')
        }
    }
}