require('dotenv').config();

const Razorpay = require('razorpay');

const {sequelize} = require('../util/database');

const { Order } = require('../models/orders');

const user = require('./user')
// // const { default: orders } = require('razorpay/dist/types/orders');

// const purchasePremium = async (req, res) => {
//     try {
//         var rzp = new Razorpay({
//             key_id:  // Secure credentials
//             key_secret: 
//         });

//         const amount = 2500;
//         const order = await rzp.orders.create({ amount , currency: "INR" });
//         await req.user.createOrder({ orderId: order.id, status: 'PENDING' });

//         res.status(201).json({ order, key_id: rzp.key_id });
//     } catch (err) {
//         console.error("Error in purchasePremium:", err);
//         res.status(403).json({ message: 'Something went wrong', error: err.message });
//     }
// };

// const updateTransactionStatus = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { payment_id, order_id } = req.body;

//         const order = await Order.findOne({ where: { orderid: order_id } });
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         await order.update({ status: 'SUCCESS', paymentid: payment_id });
//         await req.user.update({ ispremiumuser: true }); // Assuming user model has this field

//         res.status(202).json({ success: true, message: "Transaction Successful" });
//     } catch (err) {
//         console.error("Error in updateTransactionStatus:", err);
//         res.status(403).json({ error: err.message, message: 'Something went wrong' });
//     }
// };


// module.exports = {purchasePremium, updateTransactionStatus }

//New Code

const paymentController = {
    buyPremium: async (req, res) => {
        const { id } = req.user
        try {
            const rzp = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            })
            const amount = 2500
            rzp.orders.create({ amount: amount, currency: 'INR' }, async (err, order) => {
                try {
                    if (err) {
                        throw new Error(JSON.stringify(err))
                    }
                    await orderModel.create({ orderId: order.id, status: "pending", userId: id })
                    res.send({ order, key_id: process.env.RZP_KEY_ID })

                } catch (error) {
                    console.log(error)
                    res.status(400).send({ message: "Some error", error: error })
                }

            })


        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "some error", error: error })
        }
    },

    updatePremiumStatus: async (req, res) => {
        let t;
        try {
            t = await sequelize.transaction()
            const { order_id, payment_id } = req.body;
            const findedorder = await orderModel.findOne({ where: { orderId: order_id } });
            await Promise.all([
                findedorder.update({ paymentId: payment_id, status: "success" }, { transaction: t }),
                req.user.update({ isPremiumUser: true }, { transaction: t })
            ])
            await t.commit()
            res.send({ success: true });
        } catch (error) {
            await t.rollback()
            res.status(400).send({ message: "some error", error: error });

        }
    },

    updateStausToFailed: async (req, res) => {
        try {
            const { order_id } = req.body;
            const findedorder = await orderModel.findOne({ where: { orderId: order_id } });
            await findedorder.update({ status: "failed" });
            res.status(400).send({ success: false, message: "Payment failed" });
        } catch (error) {
            // Handle the original error
            res.status(400).send({ message: "some error", error: error });
        }
    }



}

module.exports = paymentController;
