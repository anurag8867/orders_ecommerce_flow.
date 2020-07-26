# orders_ecommerce_flow

    # Language : JavaScript
            * All the functions are accomadated with meaning full names which defines the functionality of the function
    # Postman Link: https://www.getpostman.com/collections/6e5c383261608f914df7

    # Write comments in the code on how you will handle race conditions?
        * Check If product Exists
        * Making sure that product must not be out of stock
        * Increase the count of order placed for the same product_id and user_id for the same product
        * Decrease the count of product's availability in inventory table
        * Transaction
        * Race Condition avilable options:
            * async-mutex (Currently Used)
            * Message Queue (Redis server)
            * Throttle
            * Debounce
    
    # Api's exposed:
            * POST
                    * Add User : ```curl --location --request POST 'http://localhost:3008/user' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "email" : "sindhuanurag21111qq1@gmail.com"
                    }'```

                    * Get Users : ```curl --location --request GET 'http://localhost:3008/users' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "email" : "sindhuanurag21111qq1@gmail.com"
                    }'``` 

                    * Add inventory: ```curl --location --request POST 'http://localhost:3008/inventory' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "name" : "sindhuanurag2111111qq1111@gmail.com",
                        "count" : 111
                    }'```
                        NOTE: No duplicate product can be added in DB

                    *  Get inventory: ```curl --location --request GET 'http://localhost:3008/inventory'```
                        NOTE: No duplicate product can be added in cart

                    *  Place Order: ```curl --location --request POST 'http://localhost:3008/order' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "productId" : 1,
                        "userId" : 1
                    }'```

                    *  Get placed Orders for a specific user: ```curl --location --request GET 'http://localhost:3008/order' \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                        "userId" : 1
                    }'```


<MYSQL installed is required>

* check your mysql config in default.json config file
* npm run i // to install project dependencies and it will execute the mocha test cases
* node app.js or npm start // to run server, also, it will do all the formalities of mysql(creating schema and tables)

# DB
    # Mysql
        Note: 
            As soon as app.js runs (Fully Automate):
                1. Connection will be made (make sure right db config available in default.json)
                2. A Database of name provided in default.json will be created (Please change the name in default.json if any chance you already have the same schema in your machine)
                3. Tables will be created with sequelize.
