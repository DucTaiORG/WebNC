const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'banking'
});

const pool_query = promisify(pool.query).bind(pool);

module.exports = {
    load: sql => pool_query(sql),
    update: (soDu, soTaiKhoan) => pool_query(`update taikhoanthanhtoan set SoDu = ${soDu} where SoTaiKhoan = ${soTaiKhoan}`) 
};