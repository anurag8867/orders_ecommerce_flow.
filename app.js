const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const authService = require('./services/auth');
const productService = require('./services/product');
const config = require('config');
const port = config.get('port');

//This will create the Database via automation if it doesn't exist in mysql'
require('./db/connect');

// Export app for other routes to use
let app = express();

// Starting point of the server
function main() {
    app.use(bodyParser.urlencoded({ // Middleware
        extended: true
    }));
    app.use(bodyParser.json());

    app.post('/user', async (req, res) => {
        try {
            let missingField = req.body.email ? null : 'email';
            if (missingField) throw {
                message: `${missingField} field is missing from body params`,
                status: 400
            }
            let { email } = req.body;
            let resp = await authService.addUser({ email });
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.get('/users', async (req, res) => {
        try {
            let resp = await authService.getUsers();
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.post('/inventory', async (req, res) => {
        try {
            let missingField = req.body.name ? req.body.count ? null : 'count' : 'name';
            if (missingField) {
                if (req.body.count === 0) throw {
                    message: `count of inventory must be greater than 0`,
                    status: 400
                }
                throw {
                    message: `${missingField} field is missing from body params`,
                    status: 400
                }
            }
            let { name, count } = req.body;
            let resp = await productService.addProduct({ name, count });
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.get('/inventory', async (req, res) => {
        try {
            let resp = await productService.getProducts();
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.post('/order', async (req, res) => {
        try {
            let missingField = req.body.productId ? req.body.userId ? null : 'userId' : 'productId';
            if (missingField) throw {
                message: `${missingField} field is missing from body params`,
                status: 400
            }
            let { productId, userId } = req.body;
            let resp = await productService.placeOrder({ productId, userId });
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.get('/order', async (req, res) => {
        try {
            let missingField = req.body.userId ? null : 'userId';
            if (missingField) throw {
                message: `${missingField} field is missing from body params`,
                status: 400
            }
            let { userId } = req.body;
            let resp = await productService.getPlacedOrders({ userId });
            return res.status(resp && resp.status || 200).send({ resp });
        } catch (e) {
            return res.status(e.status || 500).send({
                message: e.message,
                error: e.error || null,
            });
        }
    });

    app.use(function (req, res) {
        res.status(404).send({ url: req.originalUrl + ' not found' })
    });

    app.listen(port, err => {
        if (err) {
            return console.error(err);
        }
        return console.log(`server is listening on ${port}`);
    });
}

main();

