const db = require('../utils/db');
const userModel = require('../models/users.model');

module.exports = {
    depositMoney: async (accNum, moneyAmount) =>{
        const rows = await userModel.singleByAccountNumber(accNum);
        if(rows.length === 0){
            return null;
        }
        const balance = rows[0].balance;
        const moneyToUpdate = moneyAmount + balance;
        return db.update('paymentaccount', {"balance": moneyToUpdate}, {"accountNumber": accNum});
    }
}