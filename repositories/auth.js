let { account } = require('../db/models');
const uuidv4 = require('uuid/v4');
class AuthRepo {
    async findUsers(email) {
        let whereQuery = { deleted_at: null };
        if (email) whereQuery["email"] = email;
        return await account.findAll({ where: whereQuery });
    }
    async saveUser(email) {
        return await account.create({ email, uuid: uuidv4() });
    }
}

module.exports = new AuthRepo();