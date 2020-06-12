const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {
    all: _ => db.load('select users.id, users.fullname, users.dateOfBirth, users.username, users.userRole' 
                        + ' from users'),

    detail: accNo => db.load(`select users.id, users.fullname, users.dateOfBirth, paymentaccount.accountNumber 
                                from users join paymentaccount on users.id = paymentaccount.userId  where paymentaccount.accountNumber = ${accNo}`),

    detailByUserId: id => db.load(`select users.id, users.fullname, users.dateOfBirth, paymentaccount.accountNumber 
                                    from users join paymentaccount on users.id = paymentaccount.userId  where users.id = ${id}`),
    
    add: entity =>{
        const password_hash = bcrypt.hashSync(entity.password, 8);
        entity.password = password_hash;
        return db.add(entity, 'users');
    },

    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    updateRefreshToken: async (userId, refreshToken) => {
        const columnToDel = {
            "refreshToken": null,
            "rdt": null
        };

        const rdt = moment().format('YYYY-MM-DD HH:mm:ss');
        const column = {
            "refreshToken": refreshToken,
            "rdt": rdt
        };
        
        const condition = {
            "id": userId
        };

        await db.update('users', columnToDel, condition);
        return db.update('users', column, condition);
    },

    verifyRefreshToken: async (userId, token) => {
        const sql = `select * from users where id = ${userId} and refreshToken = '${token}'`;
        const rows = await db.load(sql);
        if(rows.length > 0){
            return true;
        }
        return false;
    },

    singleByAccountNumber: accNum => {
        return db.load(`select * from paymentaccount where accountNumber = ${accNum}`);
    },

    singleByUserId: userId => {
        return db.load(`select * from users where id = ${userId}`);
    }
}