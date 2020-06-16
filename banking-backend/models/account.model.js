const db = require('../utils/db');
const userModel = require('../models/users.model');

module.exports = {
    getPaymentAccountByUserId: async (userId) => {
        const userList = await userModel.singleByUserId(userId)
        if(userList.length === 0){
            return null;
        }
        if(userList[0].userRole != 1){
            return null;
        }

        const accountList = await db.load(`select paymentaccount.accountNumber, paymentaccount.balance from paymentaccount 
                                                join users on users.id = paymentaccount.userId 
                                                    where users.id = ${userId}`);

        return accountList;
    },

    getSavingAccountByUserId: async (userId) => {
        const userList = await userModel.singleByUserId(userId)
        if(userList.length === 0){
            return null;
        }

        if(userList[0].userRole != 1){
            return null;
        }

        const accountList = await db.load(`select savingaccount.accountNumber, savingaccount.balance from savingaccount 
                                                join users on users.id = savingaccount.userId 
                                                    where users.id = ${userId}`);

        return accountList;
    },
}