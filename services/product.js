const productRepo = require('../repositories/product');
const orderService = require('./order');

class ProductService {

    async addProduct({ name, count }) {
        try {
            return await productRepo.addProduct({ name, count });
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") throw {
                message: "A product with same name already exists. Please register prodduct with some different name",
                status: 409
            };
            throw e;
        }
    }

    async getProducts() {
        return await productRepo.getProducts();
    }

    async placeOrder({ productId, userId }) {
        let resp;

        resp = await orderService.executeOrder(
            { productId, userId }
        );
        return resp;
    }


    async getPlacedOrders({ userId }) {
        return await productRepo.getPlacedOrders({ userId });
    }

}

module.exports = new ProductService();