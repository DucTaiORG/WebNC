const db = require('../utils/db');

module.exports = {
    all: _ => db.load(`select users.fullname, users.username, users.phoneNo, users.dateOfBirth, users.email from users where userRole = 2`),
}