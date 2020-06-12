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
    }
}