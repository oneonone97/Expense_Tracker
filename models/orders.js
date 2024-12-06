const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    orderId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    paymentid:{
        type:Sequelize.STRING
    },
    orderid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Order;