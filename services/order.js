const productRepo = require('../repositories/product');
const { Mutex } = require('async-mutex');

class PaymentService {
    constructor() {
        this.locks = new Map();
    }

    async executeOrder({ productId, userId }) {
        if (!this.locks.has(userId)) {
            this.locks.set(userId, new Mutex());
        }

        return new Promise((resolve, reject) => {
            this.locks
                .get(userId)
                .acquire()
                .then((release) => {
                    try {
                        productRepo.placeOrder(
                            { inventory_id: productId, user_id: userId }
                        ).then((data) => {
                            release();
                            return resolve(data);
                        }).catch((err) => {
                            return reject(err);
                        });
                    } catch (error) {
                        return reject(err);
                    }
                });
        })
    }
}

module.exports = new PaymentService();