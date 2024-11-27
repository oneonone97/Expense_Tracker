const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('Expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    amount: {
        type: Sequelize.INTEGER, // Change to FLOAT if amounts include decimals
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    category: {
        type: Sequelize.STRING, // Add this field to support categories
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE, // Add this field to support dates
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Expense;
