const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const randToken = require('rand-token');

module.exports = {
    all: _ => db.load('select users.id, users.fullname, users.dateOfBirth, users.username, users.userRole' 
                        + ' from users'),

    detailByAccNumber: accNo => db.load(`select paymentaccount.accountNumber, users.fullname, users.phoneNo, users.dateOfBirth, users.email
                                from users join paymentaccount on users.id = paymentaccount.userId  where paymentaccount.accountNumber = ${accNo}`),

    detailByUserId: id => db.load(`select users.id, paymentaccount.accountNumber, users.fullname, users.phoneNo, users.dateOfBirth 
                                    from users join paymentaccount on users.id = paymentaccount.userId  where users.id = ${id}`),

    detailBalanceByUserId: id => db.load(`select users.id, paymentaccount.accountNumber, paymentaccount.balance 
                                            from users join paymentaccount on users.id = paymentaccount.userId  where users.id = ${id}`),
    
    add: async entity =>{
        const password_hash = bcrypt.hashSync(entity.password, 8);
        entity.password = password_hash;
        const ret = await db.add(entity, 'users');
        if(entity.userRole === 1){
            const userId = ret.insertId;
            const accountNumber = randToken.generator({
                chars: '123456789'
            }).generate(9);
            const paymentEntity = {
                userId,
                accountNumber,
                balance: 0
            }
            const resultAccPayment = await db.add(paymentEntity, 'paymentaccount');
            if(resultAccPayment.insertId){
                return ret;
            }else{
                return null;
            }
        }

        return ret;
    },

    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    updateRefreshToken: async (userId, refreshToken) => {
        const rdt = moment().format('YYYY-MM-DD HH:mm:ss');
        const column = {
            "refreshToken": refreshToken,
            "rdt": rdt
        };
        
        const condition = {
            "id": userId
        };

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
        return db.load(`select users.id, users.username, users.fullname, users.dateOfBirth, users.email, users.phoneNo, users.userRole from users where id = ${userId}`);
    },

    addToDepositHistory: async (accNum, moneyAmount) => {
        const entity = {
            "account_num": accNum,
            "money_amount": moneyAmount,
            "deposit_time": moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const result = await db.add(entity, 'deposit_history');
        return result;        
    },

    addToReceiveAccount: async(accountNumber, rememberName) => {
        const entity = {
            "accountNumber": accountNumber,
            "rememberName": rememberName
        }

        const result = await db.add(entity, 'receiveaccount');
        // const loadReceiveUser = await db.load(`SELECT * FROM receiveaccount WHERE accountNumber = ${accountNumber}`);
        return result;
    },

    loadContactWithAccountNumber: (accountNumber) => {
        return db.load(`SELECT * FROM receiveaccount WHERE accountNumber = ${accountNumber}`)
    },

    addContact: async (userId, receiveUserID) => {
        const entity = {
            "userID": userId,
            "receiveUserID": receiveUserID
        }

        
        const result = await db.add(entity, 'users_add_users');
        return result;
    },

    showUserContact: userId => {
        return db.load(`SELECT receiveaccount.accountNumber, receiveaccount.rememberName FROM receiveaccount JOIN users_add_users ON receiveaccount.id = users_add_users.receiveUserID WHERE users_add_users.userID = ${userId}`);
    },

    getDepositHistory: userId => {
        return db.load(`SELECT deposit_history.money_amount, deposit_history.account_num, deposit_history.deposit_time from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN deposit_history ON deposit_history.account_num = paymentaccount.accountNumber
                                WHERE users.id = ${userId} 
                                    ORDER BY deposit_history.deposit_time DESC`);
    },

    getTransferHistory: userId =>{
        return db.load(`SELECT transfer_history.money_amount, transfer_history.from_account, transfer_history.to_account, transfer_history.time from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN transfer_history ON transfer_history.from_account = paymentaccount.accountNumber OR transfer_history.to_account = paymentaccount.accountNumber
                                WHERE users.id = ${userId} AND transfer_history.isSuccess = true
                                    GROUP BY transfer_history.time
                                    ORDER BY transfer_history.time DESC`);
    }
}