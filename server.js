const express = require('express');

const app=express();

const sequelize=require('./util/database');

const User=require('./models/users');

const path = require('path');

const userRouter=require('./routes/user');

const authenticate = require('./middleware/authenticate');

//
const helmet = require('helmet');
const Expense = require('./models/expense');
const cors=require('cors');
const expenseRoutes = require('./routes/expense');
const bodyParser = require('body-parser')
const axios = require('axios');



app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());




// app.use(express.json());

app.use(helmet({ contentSecurityPolicy: false }));

app.use('/user',userRouter);

app.use('/expense', expenseRoutes);

// One to Many Relationship
User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
    .sync()

    .then(result=>{
        app.listen(3001);
    })
    .catch(err=>console.log(err)); 