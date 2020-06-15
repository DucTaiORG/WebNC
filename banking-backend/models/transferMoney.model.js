const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from paymentaccount'),
    getBalance: accNo => db.load(`select balance from paymentaccount where accountNumber = ${accNo}`),
    update: (balance, accNum) => {
        const column = {
            "balance": balance
        };
        
        const condition = {
            "accountNumber": accNum
        }
        return db.update('paymentaccount', column, condition);
    },

    addToHistory: (id, moneyAmount, time, sign) => {
        const entity = {
            partnerId: id,
            money_amount: moneyAmount,
            transfer_time: time,
            signature: sign
        }

        return db.add(entity, 'partner_transfer_history');
    }
}