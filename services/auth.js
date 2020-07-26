let authRepo = require('../repositories/auth');

class AuthService {

    async addUser({ email }) {
        try {
            return await authRepo.saveUser(email);
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") throw {
                message: "A user with same email id already exists. Please login with the same email",
                status: 409
            };
            throw e;
        }
    }

    async getUsers() {
        return await authRepo.findUsers();
    }
}

module.exports = new AuthService();