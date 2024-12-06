// const axios = require('axios');

// const { default: axios, options } = require("axios");
// const Razorpay = require("razorpay");

function addExpense(event) {
    event.preventDefault();

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

// Razorpay Code 

// document.getElementById('rzp-button').onclick = async function (e) {
//     e.preventDefault();

//     const token = localStorage.getItem('token');
//     try {
//         // Call the server to create a Razorpay order
//         const response = await axios.get('http://localhost:3001/purchase/premiumMembership', {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });

//         console.log(response);

//         var options = {
//             "key": 'rzp_test_n79MMT3uPVSmEd', // Razorpay key ID
//             "order_id": 'order_PRp3Swf5i28ZuM', // Order ID from the server
//             "handler": async function (response) {
//                 try {
//                     // Post payment success to the server
//                     const result = await axios.post(
//                         'http://localhost:3001/purchase/updateTransactionStatus',
//                         {
//                             orderid: options.order_id,
//                             payment_id: response.razorpay_payment_id,
//                         },
//                         { headers: { 'Authorization': `Bearer ${token}` } }
//                     );
//                     alert('You are now a Premium User!');
//                     document.getElementById('rzp-button').style.visibility="hidden";
//                     document.getElementById('message').innerHTML = "You are a Premium User"
//                     console.log(result);
//                 } catch (err) {
//                     console.error('Error updating transaction status:', err);
//                     alert('Transaction status update failed.');
//                 }
//             },
//         };

//         const rzp1 = new Razorpay(options);
//         rzp1.open();

//         rzp1.on('payment.failed', function (response) {
//             console.error('Payment failed:', response);
//             alert('Payment failed. Please try again.');
//         });
//     } catch (err) {
//         console.error('Error initiating Razorpay:', err);
//         alert('Failed to initiate premium membership. Please try again.');
//     }
// };

document.getElementById('rzp-button').onclick = async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve user token
    if (!token) {
        alert('You must be logged in to purchase premium membership.');
        return;
    }

    try {
        // Call the server to create a Razorpay order
        const { data } = await axios.post(
            'http://localhost:3001/payment/buyPremium',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
            key: 'rzp_test_n79MMT3uPVSmEd', // Razorpay key ID from the server
            order_id: 'order_PRp3Swf5i28ZuM', // Order ID from the server
            handler: async function (response) {
                try {
                    // Notify the server of successful payment
                    await axios.post(
                        'http://localhost:3001/payment/updateTransactionStatus',
                        {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    alert('You are now a Premium User!');
                    document.getElementById('rzp-button').style.visibility = 'hidden';
                    document.getElementById('message').innerHTML = 'You are a Premium User!';
                } catch (error) {
                    console.error('Error updating transaction status:', error);
                    alert('Failed to update transaction status. Please contact support.');
                }
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', async function (response) {
            try {
                // Notify the server of failed payment
                await axios.post(
                    'http://localhost:3001/payment/updateStatusToFailed',
                    { order_id: options.order_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Payment failed. Please try again.');
            } catch (error) {
                console.error('Error updating payment failure status:', error);
                alert('Failed to process failed payment status.');
            }
        });
    } catch (error) {
        console.error('Error initiating Razorpay:', error);
        alert('Failed to initiate premium membership. Please try again.');
    }
};







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



