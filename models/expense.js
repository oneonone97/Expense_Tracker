const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Automatically set the current timestamp if not provided
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ensure this matches your database schema
    },
});

module.exports = Expense;
