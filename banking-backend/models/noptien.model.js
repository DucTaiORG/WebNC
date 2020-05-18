const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from taikhoanthanhtoan'),
    update: (soDu, soTaiKhoan) => {
        // "id": 1,
        // "SoTaiKhoan": "123456789",
        // "NgaySinh": "0000-00-00",
        // "TenDangNhap": "ductai",
        // "SoDu": "1000000"
        return db.update(soDu, soTaiKhoan);
    }
}