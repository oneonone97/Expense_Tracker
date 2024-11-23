// const { where } = require('sequelize');
// // const Expense = require('../models/expense');
// const Expense = require('../models/expense.js');

// const sequelize = require('../util/database.js');


// const   addExpense = async(req, res) => {
//     try{
//         console.log('Request received:', req.body);
//         const expenseRequest = req.body;
//         const requiredRequest = {amount,description,category};
//         requiredRequest.amount = expenseRequest.amount;
//         requiredRequest.description = expenseRequest.description;
//         requiredRequest.category = expenseRequest.type;
//         console.log("Name: ", {amount, description, type});
//         if (!amount || !description || !category) {
//             return res.status(400).json({success: false, message: 'Parameters missing'})
//         }
//         await Expense.create(requiredRequest).then(expense => {
//             return res.status(201).json({expense, success: true});
//         })
//     } 
//     catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ error: "Failed to login" });
// }
// }

// const getExpenses = async(req, res) => {
//     Expense.findAll().then(expenses => {
//         return res.status(200).json({expenses, success: true})
//     })
//     .catch(err => {
//         return res.status(500).json({error: err, success: false})
//     })
// }


// const deleteExpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     if (expenseid == undefined || expenseid.length === 0) {
//         return res.status(400).json({success: false})
//     }
//     Expense.destroy({where: {id: expenseid}}).then(() => {
//         return res.status(200).json({success: true, message: "Deleted Successfully"})
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({success: true, message: "Failed"})
//     })
// }

// module.exports = { deleteExpense, addExpense, getExpenses};


const { where } = require('sequelize');
const {sequelize} = require('../util/database.js')
const Expense = require('../models/expense.js');





// const addExpense = async (req, res) => {
//     try {
//         console.log('Request received:', req.body);

//         const expenseRequest = req.body;
//         const requiredRequest = {
//             amount: expenseRequest.amount,
//             description: expenseRequest.description,
//             category: expenseRequest.type
//         };

//         console.log("Request Data: ", requiredRequest);

//         if (!requiredRequest.amount || !requiredRequest.description || !requiredRequest.category) {
//             return res.status(400).json({ success: false, message: 'Parameters missing' });
//         }

//         await Expense.create(requiredRequest).then(expense => {
//             return res.status(201).json({ expense, success: true });
//         });
//     } catch (err) {
//         console.error("Add Expense Error:", err);
//         res.status(500).json({ error: "Failed to add expense" });
//     }
// };

const addExpense = async (req, res) => {
    try {
        console.log('Request received:', req.body);

        const expenseRequest = req.body;
        const requiredRequest = {
            amount: expenseRequest.amount,
            description: expenseRequest.description,
            category: expenseRequest.type,
            userId: req.user.id,
            date: expenseRequest.date || new Date() // Use the provided date or default to the current timestamp
        };

        console.log("Request Data: ", requiredRequest);

        if (!requiredRequest.amount || !requiredRequest.description || !requiredRequest.category) {
            return res.status(400).json({ success: false, message: 'Parameters missing' });
        }

        const expense = await Expense.create(requiredRequest);
        return res.status(201).json({ expense, success: true });
    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).json({ error: "Failed to add expense" });
    }
};


// const getExpenses = async (req, res) => {
//     Expense.findAll()
//         .then(expenses => {
//             return res.status(200).json({ expenses, success: true });
//         })
//         .catch(err => {
//             console.error("Error fetching expenses:", err);
//             return res.status(500).json({ error: "Failed to fetch expenses", success: false });
//         });
// };

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            attributes: ['id', 'amount', 'description', 'category'], // Ensure the correct fields are selected
        });

        // Map category to type (if needed)
        const formattedExpenses = expenses.map(expense => ({
            id: expense.id,
            amount: expense.amount,
            description: expense.description,
            type: expense.category, // Map category to type
        }));

        return res.status(200).json({ expenses: formattedExpenses, success: true });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        return res.status(500).json({ error: "Failed to fetch expenses", success: false });
    }
};



// const getExpenses = async (req, res) => {
//     try {
//         // Perform the raw query (like the 'ration' example)
//         const [results] = await sequelize.query('SELECT * FROM expenses');
        
//         // Return the results as a response in the same structure
//         return res.status(200).json({ expenses: results, success: true });
//     } catch (err) {
//         console.error("Error fetching expenses:", err);
//         return res.status(500).json({ error: "Failed to fetch expenses", success: false });
//     }
// };

// const getExpenses = async (req, res) => {
//     try {
//         const expenses = await Expense.findAll();
//         return res.status(200).json({ expenses, success: true });
//     } catch (err) {
//         console.error("Error fetching expenses:", err);
//         return res.status(500).json({ error: "Failed to fetch expenses", success: false });
//     }
// };


// const deleteExpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     if (!expenseid) {
//         return res.status(400).json({ success: false, message: "Expense ID is required" });
//     }
//     Expense.destroy({ where: { id: expenseid } })
//         .then(() => {
//             return res.status(200).json({ success: true, message: "Deleted Successfully" });
//         })
//         .catch(err => {
//             console.error("Error deleting expense:", err);
//             return res.status(500).json({ success: false, message: "Failed to delete expense" });
//         });
// };

const deleteExpense = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ success: false, message: "Expense ID is required" });
        }

        console.log("Delete request for expense ID:", id);

        // Delete expense for the logged-in user
        const result = await Expense.destroy({ where: { id: id, userId: req.user.id } });

        if (result === 0) {
            // No rows affected means expense does not belong to user or does not exist
            return res.status(404).json({ success: false, message: "Expense not found or does not belong to user" });
        }

        // Successful deletion
        return res.status(200).json({ success: true, message: "Deleted Successfully" });

    } catch (err) {
        console.error("Error deleting expense:", err);
        return res.status(500).json({ success: false, message: "Failed to delete expense" });
    }
};





module.exports = { deleteExpense, addExpense, getExpenses };
