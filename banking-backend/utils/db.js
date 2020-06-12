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
    update: (tableName, column, condition) => pool_query(`update ${tableName} set ? where ?`, [column, condition]),
    add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
    delete: (tableName, condition) => pool_query(`delete from ${tableName} where ?`, condition)
};