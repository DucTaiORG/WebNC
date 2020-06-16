const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const userModel = require('../models/users.model');
const config = require('../config/default.json');

module.exports = {
    verifyUser: (req, res, next) => {
        const token = req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.secretKey, function(err, payload){
                if(err){
                    next(createError(401, err));
                    return;
                }
                const {userId} = payload;
                const rows = await userModel.singleByUserId(userId);
                const userRole = rows[0].userRole;
                if(userRole !== 1){
                    next(createError(402, 'Do not allow to access resource'));
                    return;
                }
                next(); 
            });
        }else{
            next(createError(401, 'No access token.'));
            return;
        }
    },

    verifyEmployee: async (req, res, next) => {
        const token = req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.secretKey, async function(err, payload){
                if(err){
                    next(createError(401, err));
                    return;
                }

                const {userId} = payload;
                const rows = await userModel.singleByUserId(userId);
                const userRole = rows[0].userRole;
                if(userRole !== 2){
                    next(createError(402, 'Do not allow to access resource'));
                    return;
                }
                next();
            });
        }else{
            next(createError(403, 'No access token.'));
            return;
        }
    },

    verifyAdmin: async (req, res, next) => {
        const token = req.headers['x-access-token'];
        if(token){
            jwt.verify(token, config.secretKey, async function(err, payload){
                if(err){
                    next(createError(401, err));
                    return;
                }

                const {userId} = payload;
                const rows = await userModel.singleByUserId(userId);
                const userRole = rows[0].userRole;
                if(userRole !== 3){
                    next(createError(401, 'Do not allow to access resource'));
                    return;
                }
                next();
            });
        }else{
            next(createError(401, 'No access token.'));
            return;
        }
    }
}