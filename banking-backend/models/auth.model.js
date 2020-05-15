const db = require('../utils/db');

module.exports = {
    detail: code => db.load(`select * from nganhanglienket where code = '${code}'`),
}