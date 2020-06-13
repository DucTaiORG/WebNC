const db = require('../utils/db');
const userModel = require('../models/users.model');

module.exports = {
    depositMoney: async (accNum, moneyAmount) =>{
        const money = Number(moneyAmount);
        const rows = await userModel.singleByAccountNumber(accNum);
        if(rows.length === 0){
            return null;
        }

        const balance = rows[0].balance;
        const moneyToUpdate = money + balance;
        return db.update('paymentaccount', {"balance": moneyToUpdate}, {"accountNumber": accNum});
    }
}