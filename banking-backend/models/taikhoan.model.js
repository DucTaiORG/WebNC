const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select taikhoan.id, taikhoan.SoTaiKhoan, taikhoan.NgaySinh, taikhoan.TenDangNhap, taikhoanthanhtoan.SoDu' 
                        + ' from taikhoan join taikhoanthanhtoan on taikhoan.id = taikhoanthanhtoan.idTaiKhoan'),
    detail: stk => db.load(`select taikhoanthanhtoan.SoTaiKhoan, taikhoan.TenNguoiDung, taikhoan.NgaySinh 
                        from taikhoan join taikhoanthanhtoan on taikhoan.id = taikhoanthanhtoan.id  where taikhoanthanhtoan.SoTaiKhoan = ${stk}`),
}