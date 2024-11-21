const express=require('express');

const router=express.Router();

const userController=require('../controller/user.js');

// const express=require('express');

// const router=express.Router();

const expenseController=require('../controller/expense.js');


router.post('/signup',userController.signup);

router.post('/login',userController.login);


// router.get('/get-expenses',expenseController.getExpenses);

// router.post('/add-expense',expenseController.addExpense);

// router.delete('/delete-expense/:id',expenseController.deleteExpense);


module.exports=router;