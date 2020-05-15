const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select taikhoan.id, taikhoan.SoTaiKhoan, taikhoan.NgaySinh, taikhoan.TenDangNhap, taikhoanthanhtoan.SoDu' 
                        + ' from taikhoan join taikhoanthanhtoan on taikhoan.id = taikhoanthanhtoan.idTaiKhoan'),
    detail: id => db.load(`select taikhoan.id, taikhoan.SoTaiKhoan, taikhoan.NgaySinh, taikhoan.TenDangNhap, taikhoanthanhtoan.SoDu` 
                        + ` from taikhoan join taikhoanthanhtoan on taikhoan.id = taikhoanthanhtoan.idTaiKhoan where taikhoan.id = ${id}`),
}