const express=require('express');

const router=express.Router();

const expenseController=require('../controller/expense');

const userAuthentication=require('../middleware/authenticate');

const purchaseController = require('../controller/purchase');


// router.get('/premiumMembership', userAuthentication.authenticate, purchaseController.purchasePremium);

// router.post('/updateTransactionStatus', userAuthentication.authenticate, purchaseController.updateTransactionStatus);

router.post('/payment/buyPremium', userAuthentication.authenticate, purchaseController.buyPremium);

router.post('/payment/updateTransactionStatus', userAuthentication.authenticate, purchaseController.updatePremiumStatus);

router.post('/payment/updateStatusToFailed', userAuthentication.authenticate, purchaseController.updateStausToFailed);

module.exports = router;