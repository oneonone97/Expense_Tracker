const express=require('express');

const router=express.Router();

const userController=require('../controller/user.js');

const expenseController=require('../controller/expense.js');

router.post('/signup',userController.signup);

router.post('/login',userController.login);

module.exports=router;