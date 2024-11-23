const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
    // ,
    
    // ispremiumuser:Sequelize.BOOLEAN,
    // totalExpenses:{
    //     type:Sequelize.INTEGER,
    //     defaultValue:0
    // }
});

module.exports=User;