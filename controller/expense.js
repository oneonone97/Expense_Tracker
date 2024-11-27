const { where } = require('sequelize');
const {sequelize} = require('../util/database.js')
const Expense = require('../models/expense.js');


// const addExpense = async (req, res) => {
//     try {
//       console.log("Request received:", req.body);
  
//       const expenseRequest = req.body;
  
//       // Use the authenticated user's ID
//       if (!req.user || !req.user.id) {
//         return res.status(401).json({ success: false, message: "Unauthorized" });
//       }
  
//       const requiredRequest = {
//         amount: expenseRequest.amount,
//         description: expenseRequest.description,
//         category: expenseRequest.type,
//         userId: req.user.id, // Use req.user.id from the middleware
//         date: expenseRequest.date || new Date(), // Default to current timestamp if no date is provided
//       };

//       const userId = req.user.id;
  
//       console.log("Request Data: ", requiredRequest, userId);
  
//       if (!requiredRequest.amount || !requiredRequest.description || !requiredRequest.category) {
//         return res.status(400).json({ success: false, message: "Parameters missing" });
//       }
  
//       const expense = await Expense.create({requiredRequest, userId: req.user.id});
  
//       return res.status(201).json({ expense, success: true });
//     } catch (err) {
//       console.error("Add Expense Error:", err);
//       res.status(500).json({ error: "Failed to add expense" });
//     }
//   };
  

// New Code

const addExpense = async (req, res) => {
  try {
      console.log("Request received:", req.body);

      // Ensure the user is authenticated
      if (!req.user || !req.user.id) {
          return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Extract and validate required fields
      const { amount, description, type: category, date } = req.body;
      if (!amount || !description || !category) {
          return res.status(400).json({ success: false, message: "Parameters missing" });
      }

      // Create the expense
      const expense = await Expense.create({
          amount,
          description,
          category, // This field must exist in your model
          userId: req.user.id,
          date: date || new Date(), // Default to current timestamp
      });

      console.log("Expense created:", expense);

      return res.status(201).json({ expense, success: true });
  } catch (err) {
      console.error("Add Expense Error:", err);
      res.status(500).json({ error: "Failed to add expense" });
  }
};

  

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


const deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Expense ID is required" });
    }

    console.log("Delete request for expense ID:", id);

    // Ensure req.user.id is valid
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Delete expense for the logged-in user
    const result = await Expense.destroy({
      where: { id: id, userId: req.user.id },
    });

    if (result === 0) {
      // No rows affected means the expense does not belong to the user or does not exist
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
