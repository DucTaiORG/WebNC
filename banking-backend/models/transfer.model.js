const db = require('../utils/db');
const moment = require('moment');
const userModel = require('../models/users.model');
const config = require('../config/default.json');

module.exports = {
    transfer: async (fromAcc, toAcc, moneyAmount, transferFee) => {
        const money = Number(moneyAmount);
        const toAccount = await userModel.singleByAccountNumber(toAcc);
        if(toAccount.length === 0){
            return null;
        }

        const fromAccount = await userModel.singleByAccountNumber(fromAcc);
        if(fromAccount.length === 0){
            return null;
        }

        const entity = {
            money_amount: money,
            from_account: fromAcc,
            to_account: toAcc,
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        const result = await db.add(entity, 'transfer_history');
        if(result.affectedRows){
            const fromAccBalance = fromAccount[0].balance;
            const toAccBalance = toAccount[0].balance;
            if(transferFee == 1){ //Sender bear the fee
                const fromAccUpdateMoney = fromAccBalance - money - config.transferFee;
                if(fromAccUpdateMoney < 0){
                    return 2;
                }
                await db.update('paymentaccount', {"balance": fromAccUpdateMoney}, {"accountNumber": fromAcc});

                const toAccUpdateMoney = money + toAccBalance;
                return db.update('paymentaccount', {"balance": toAccUpdateMoney}, {"accountNumber": toAcc});
            }else{
                const fromAccUpdateMoney = fromAccBalance - money;
                if(fromAccUpdateMoney < 0){
                    return 2;
                }
                await db.update('paymentaccount', {"balance": fromAccUpdateMoney}, {"accountNumber": fromAcc});
                
                const toAccUpdateMoney = money + toAccBalance - config.transferFee;
                return db.update('paymentaccount', {"balance": toAccUpdateMoney}, {"accountNumber": toAcc});
            }

        }
        
        return 1;
    }
}