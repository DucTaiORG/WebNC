const db = require('../utils/db');
const userModel = require('../models/users.model');

module.exports = {
    depositMoney: async (accNum, moneyAmount) =>{
        const money = Number(moneyAmount);
        const rows = await userModel.singleByAccountNumber(accNum);
        if(rows.length === 0){
            return null;
        }

        const result = await userModel.addToDepositHistory(accNum, moneyAmount);
        if(result.affectedRows){
            const balance = rows[0].balance;
            const moneyToUpdate = money + balance;
            return db.update('paymentaccount', {"balance": moneyToUpdate}, {"accountNumber": accNum});
        }
        
        return 1;
    },

    getDepositHistory: async accNum =>{
        const rows = await db.load(`select * from deposit_history where account_num = '${accNum}' order by time DESC`);
        if(rows.length === 0){
            return null;
        }

        return rows;
    }
}