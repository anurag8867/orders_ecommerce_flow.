const uuidv4 = require('uuid/v4');
const Sequelize = require('sequelize');
const config = require('config');
let sequelize = new Sequelize(config.get('mysql.database'), config.get('mysql.user'), config.get('mysql.password'),
    config.get('mysql'));
sequelize.sync();

const account = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: uuidv4()
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});


const inventory = sequelize.define('inventory', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: uuidv4()
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

const orders = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: uuidv4()
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: account,
            key: 'id'
        }
    },
    inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: inventory,
            key: 'id'
        }
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
});

inventory.hasOne(orders, { foreignKey: 'inventory_id' });
orders.belongsTo(inventory, { foreignKey: 'inventory_id' });

module.exports = { account, orders, inventory, sequelize }