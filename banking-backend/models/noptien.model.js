const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from taikhoanthanhtoan'),
    getSoDu: soTaiKhoan => db.load(`select SoDu from taikhoanthanhtoan where SoTaiKhoan = ${soTaiKhoan}`),
    update: (soDu, soTaiKhoan) => {
        return db.update(soDu, soTaiKhoan);
    }
}