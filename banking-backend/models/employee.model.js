const db = require('../utils/db');

module.exports = {
    all: _ => db.load(`select users.id, users.fullname, users.username, users.phoneNo, users.dateOfBirth, users.email from users where userRole = 2`),

    update: entity => {
        const condition = {
            id: entity.id
        }
        return db.update(`users`, entity, condition);
    },

    singleByUserId: id =>{
        return db.load(`select users.id, users.fullname, users.username, users.phoneNo, users.dateOfBirth, users.email from users where id = ${id} and userRole = 2`);
    },

    delete: empId => {
        const condition = {
            id: empId
        }

        return db.delete('users', condition);
    }
}