const db = require('../utils/db');
const userModel = require('../models/users.model');
const bcrypt = require('bcryptjs');

module.exports = {
    detail: code => db.load(`select * from partbank where partCode = '${code}'`),
    login: async entity => {
        const row = await userModel.singleByUserName(entity.username);
        if(row.length === 0){
            return null;
        }

        const hashPass = row[0].password;
        if(bcrypt.compareSync(entity.password, hashPass)){
            return row[0];
        }

        return null;
    }
}