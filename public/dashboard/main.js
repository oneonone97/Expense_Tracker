function addExpense(e) {
    e.preventDefault();

    const expenseDetails = {
        amount: document.getElementById('amount').value.trim(),
        description: document.getElementById('description').value.trim(),
        type: document.getElementById('type').value
    };

    console.log(expenseDetails);
    const token = localStorage.getItem('token')
    console.log('Token', token);
    axios.post(
        'http://localhost:3001/expense/add-Expense', 
        expenseDetails, {
        headers: { 'Authorization': `Bearer ${token}` }, // Include "Bearer" prefix if required
    })
        .then((response) => {
            console.log(response);
            addNewExpensetoUi(response.data.expense);
        })
        .catch(err => showError(err));
}





// Remove Expense from UI
function removeExpensefromUI(id) {
    const expenseElemId = `expense-${id}`;
    document.getElementById(expenseElemId).remove;

}





// Function to add an expense to the UI
function addNewExpensetoUi(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;

    // Create a new list item for the expense
    const listItem = document.createElement('li');
    listItem.id = expenseElemId;

    // Adding the expense details, including type, to the list item
    listItem.innerHTML = `
        ${expense.amount} - ${expense.type} - ${expense.description}
        <button onclick="deleteExpense(${expense.id})">Delete</button>
    `;

    // Append the list item to the parent element
    parentElement.appendChild(listItem);
}

// Event listener for DOMContentLoaded to fetch and display expenses
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not logged in. Please login to view expenses.");
            return;
        }

        // Make an authenticated GET request to fetch expenses
        const response = await axios.get('http://localhost:3001/expense/get-expenses', {
            headers: { 'Authorization': `Bearer ${token}` }, // Include token in the Authorization header
        });

        //const response = await axios.get('http://localhost:3001/expense/get-expenses');

        console.log("Expenses fetched successfully:", response.data);

        const expenses = response.data.expenses || []; // Ensure the data is defined

        if (expenses.length === 0) {
            console.log("No expenses to display.");
        } else {
            // Loop through and add each expense to the UI
            expenses.forEach(expense => {
                addNewExpensetoUi(expense);
            });
        }
    } catch (err) {
        console.error("Error fetching expenses:", err);

        // Handle token-related errors
        if (err.response && err.response.status === 401) {
            alert("Your session has expired or you are unauthorized. Please login again.");
        } else {
            alert("Failed to fetch expenses.");
        }
    }
});


// Function to delete an expense
async function deleteExpense(id) {
    if (!id) {
        alert("Invalid expense ID.");
        return;
    }

    try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not logged in. Please log in to delete expenses.");
            return;
        }

        // Make the DELETE request with the Authorization header
        const response = await axios.delete(`http://localhost:3001/expense/delete-expense/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }, // Include JWT token
        });

        console.log("Delete response:", response.data);

        // Remove the deleted expense from the UI
        const expenseElem = document.getElementById(`expense-${id}`);
        if (expenseElem) {
            expenseElem.remove();
        }

        alert("Expense deleted successfully!");
    } catch (err) {
        console.error("Error deleting expense:", err);

        // Handle token or authorization errors
        if (err.response && err.response.status === 401) {
            alert("Unauthorized request. Please log in again.");
        } else if (err.response && err.response.status === 404) {
            alert("Expense not found.");
        } else {
            alert("Failed to delete expense. Please try again.");
        }
    }
}



