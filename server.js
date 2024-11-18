const express = require('express');

const cors=require('cors');

const app=express();

const sequelize=require('./util/database');

const User=require('./models/users');

const userRouter=require('./routes/user');

app.use(cors());

app.use(express.json());

app.use('/user',userRouter);


sequelize
    .sync()

    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>console.log(err));