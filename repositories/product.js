let { inventory, orders, sequelize } = require('../db/models');
class ProductRepo {

    async addProduct({ name, count = 1 }) {
        return await inventory.create({ name, count });
    }

    async placeOrder({ inventory_id, user_id }) {
        // Transaction Support

        let transaction = null;
        try {

            let [product, order] = await Promise.all([
                inventory.findOne({ where: { id: inventory_id, deleted_at: null } }),
                orders.findOne({ where: { inventory_id, user_id, deleted_at: null } })
            ]);

            // Check If product Exists
            if (!product) throw {
                message: "No product exists with the given ID",
                status: 409
            };

            //Making sure that product must not be out of stock
            if (product.dataValues.count < 1) throw {
                message: "Product is out of stock",
                status: 409
            };

            transaction = await sequelize.transaction();
            //Decrease the count of product's availability in inventory table
            let parallelQuery = [product.update({ count: product.dataValues.count - 1 }, { transaction })];
            if (order) {

                // Increase the count of order placed for the same product_id and user_id for the same product
                parallelQuery.push(order.update({ count: order.dataValues.count + 1 }, { transaction }));
            } else {

                parallelQuery.push(orders.create({ inventory_id, user_id }, { transaction }));
            }
            let [inventoryResp, orderResp] = await Promise.all(parallelQuery);
            await transaction.commit();
            return { inventoryResp, orderResp };

        } catch (e) {
            if (transaction) {
                await transaction.rollback();
            }
            throw e;
        }
    }

    async getPlacedOrders({ userId }) {
        return await orders.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: inventory,
                where: { deleted_at: null },
                required: true
            }]
        });
    }

    async getProducts() {
        let searchQuery = {
            deleted_at: null
        };
        return await inventory.findAll({ where: searchQuery });

    }

    async getProduct(name, description, price, make, userId,) {
        let searchQuery = {
            deleted_at: null,
            name,
            price,
            make,
            description,
            user_id: userId
        };
        return await inventory.findOne({ where: searchQuery });
    }
}

module.exports = new ProductRepo();