const express = require('express');

const cors=require('cors');

const app=express();

const sequelize=require('./util/database');

const User=require('./models/users');

const path = require('path');

const userRouter=require('./routes/user');

//

const expenseRoutes = require('./routes/expense');
const bodyParser = require('body-parser')
const axios = require('axios');
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", "data:"],
        }
    }
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(express.json());

app.use('/user',userRouter);

app.use('/expense', expenseRoutes);



sequelize
    .sync()

    .then(result=>{
        app.listen(3001);
    })
    .catch(err=>console.log(err));