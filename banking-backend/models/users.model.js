const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const randToken = require('rand-token');
const config = require('../config/default.json');

const self = module.exports = {
    all: _ => db.load('select users.id, users.fullname, users.dateOfBirth, users.username, users.userRole' 
                        + ' from users'),

    detailByAccNumber: accNo => db.load(`select paymentaccount.accountNumber, users.fullname, users.phoneNo, users.dateOfBirth, users.email
                                from users join paymentaccount on users.id = paymentaccount.userId  where paymentaccount.accountNumber = ${accNo}`),

    detailByUserId: id => db.load(`select users.id, paymentaccount.accountNumber, users.fullname, users.phoneNo, users.dateOfBirth, users.email
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
        return db.load(`SELECT receiveaccount.accountNumber, receiveaccount.rememberName, users_add_users.receiveUserID FROM receiveaccount JOIN users_add_users ON receiveaccount.id = users_add_users.receiveUserID WHERE users_add_users.userID = ${userId}`);
    },

    updateContact: (accountNumber, rememberName, id) => {
        return db.load(`UPDATE receiveaccount SET accountNumber = '${accountNumber}', rememberName = '${rememberName}' WHERE receiveaccount.id = ${id}`);
    },

    deleteUsersAddUsers: (userId, receiveUserID) => {
        return db.load(`DELETE FROM users_add_users WHERE users_add_users.userID = '${userId}' AND users_add_users.receiveUserID = '${receiveUserID}'`);
    },

    deleteContact: receiveUserID => {
       return db.load(`DELETE FROM receiveaccount WHERE receiveaccount.id = '${receiveUserID}'`)
    },

    getDepositHistory: userId => {
        return db.load(`SELECT deposit_history.money_amount, deposit_history.account_num, deposit_history.time from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN deposit_history ON deposit_history.account_num = paymentaccount.accountNumber
                                WHERE users.id = ${userId} 
                                    ORDER BY deposit_history.time DESC`);
    },

    getTransferHistory: userId =>{
        return db.load(`SELECT transfer_history.money_amount, transfer_history.from_account, transfer_history.to_account, transfer_history.time from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN transfer_history ON transfer_history.from_account = paymentaccount.accountNumber OR transfer_history.to_account = paymentaccount.accountNumber
                                WHERE users.id = ${userId} AND transfer_history.isSuccess = true
                                    GROUP BY transfer_history.time
                                    ORDER BY transfer_history.time DESC`);
    },

    addDebt: async (lenderAcc, debtorAcc, money, content)=>{
        const debtor = await self.detailByAccNumber(debtorAcc);
        if(debtor.length == 0){
            return null;
        }

        const entity = {
            lender: lenderAcc,
            debtor: debtorAcc,
            money_amount: money,
            content,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            isActive: true
        }

        return db.add(entity, 'debt');
    },

    getAllDebtByUserId: async (userId)=>{
        return db.load(`SELECT debt.id, debt.lender, debt.debtor, debt.money_amount, debt.content, debt.time, debt.status from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN debt ON debt.lender = paymentaccount.accountNumber OR debt.debtor = paymentaccount.accountNumber
                                WHERE users.id = ${userId} and debt.isActive = true
                                GROUP BY debt.time
                                ORDER BY debt.time DESC`);
    },

    getDebtById: id =>{
        return db.load(`SELECT  * FROM debt WHERE id = ${id}`);
    },

    addPaydebtHistory: async (debtId, userId) => {
        const ret = await self.getDebtById(debtId);
        if(ret.length == 0){
            return null;
        }

        const {lender, debtor} = ret[0];
        const user = await self.singleByAccountNumber(debtor);
        if(user[0].userId != userId){
            console.log("not debtor");
            return 1;
        }
        
        const otpNumber = randToken.generator({
            chars: '123456789'
        }).generate(6);

        const entity = {
            debtId,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            otp_number: otpNumber,
            isSuccess: false
        };

        const result = await db.add(entity, 'pay_debt_history');
        if(result.insertId){
            return otpNumber;
        }
        return null;
    },

    verifyPayOTP: async otpNum => {
        const otp = Number(otpNum);
        const transferList = await db.load(`select * from pay_debt_history where otp_number = ${otp} and otp_number != 0`);
        if(transferList.length == 0){
            return false;
        }
        return true;
    },

    payDebt: async (debtId, userId, otp) => {
        const rowsDebt = await self.getDebtById(debtId);
        
        const {lender, debtor, money_amount} = rowsDebt[0];

        const ret = await self.getDebtById(debtId);
        if(ret.length == 0){
            return null;
        }

        const user = await self.singleByAccountNumber(debtor);
        if(user[0].userId != userId){
            console.log("not debtor");
            return 1;
        }

        const toAccount = await self.singleByAccountNumber(lender);
        if(toAccount.length === 0){
            return null;
        }

        const fromAccount = await self.singleByAccountNumber(debtor);
        if(fromAccount.length === 0){
            return null;
        }

        const fromAccBalance = fromAccount[0].balance;
        const toAccBalance = toAccount[0].balance;

        const fromAccUpdateMoney = fromAccBalance - money_amount - config.transferFee;

        if(fromAccUpdateMoney < 0){
            return 2;
        }

        const historyUpdate = await db.update('pay_debt_history', {"otp_number": 0, "isSuccess": true}, {"otp_number": otp});
        console.log(historyUpdate);
        if(historyUpdate.affectedRows === 0){
            return 3;
        }
        const debtUpdate = await db.update('debt', {"status": 1}, {"id": debtId});

        if(debtUpdate.affectedRows === 0){
            return 3;
        }
        
        await db.update('paymentaccount', {"balance": fromAccUpdateMoney}, {"accountNumber": debtor});
        const toAccUpdateMoney = money_amount + toAccBalance;
        return db.update('paymentaccount', {"balance": toAccUpdateMoney}, {"accountNumber": lender});
    },

    delDebt: async (id) => {
        const condition = {
            id,
        }

        const column = {
            isActive: false
        }
        const ret = await db.update('debt', column, condition);
        if(ret.affectedRows){
            return true;
        }
        return false;
    },

    getPayDebtHistory: userId =>{
        return db.load(`SELECT debt.lender, debt.debtor, debt.money_amount, pay_debt_history.time from users 
                            JOIN paymentaccount ON users.id = paymentaccount.userId 
                            JOIN debt ON debt.lender = paymentaccount.accountNumber OR debt.debtor = paymentaccount.accountNumber
                            JOIN pay_debt_history on debt.id = pay_debt_history.debtId
                                WHERE users.id = ${userId} AND pay_debt_history.isSuccess = true
                                    GROUP BY pay_debt_history.time
                                    ORDER BY pay_debt_history.time DESC`);
    }
}