const express=require('express');

const router=express.Router();

const expenseController=require('../controller/expense');

const userAuthentication=require('../middleware/authenticate');


router.get('/get-expenses',userAuthentication.authenticate, expenseController.getExpenses);

router.post('/add-Expense',userAuthentication.authenticate, expenseController.addExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate ,expenseController.deleteExpense);

module.exports=router;