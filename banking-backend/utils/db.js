const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'sql12.freemysqlhosting.net',
    port: 3306,
    user: 'sql12342722',
    password: 'dBMjMZ1JCn',
    database: 'sql12342722'
});

const pool_query = promisify(pool.query).bind(pool);

module.exports = {
    load: sql => pool_query(sql),
    update: (soDu, soTaiKhoan) => pool_query(`update taikhoanthanhtoan set SoDu = '${soDu}' where SoTaiKhoan = '${soTaiKhoan}'`) 
};