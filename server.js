// // require('dotenv').config();

// const dotenv = require('dotenv');

// const express = require('express');

// const app=express();

// const sequelize=require('./util/database');



// const path = require('path');

// const userRouter=require('./routes/user');

// const authenticate = require('./middleware/authenticate');

// const purchaseRoutes = require('./routes/purchaseRoutes');

// const User=require('./models/users');

// const Order = require('./models/orders');



// //
// const helmet = require('helmet');
// const Expense = require('./models/expense');
// const cors=require('cors');
// const expenseRoutes = require('./routes/expense');
// const bodyParser = require('body-parser')
// const axios = require('axios');



// app.use(helmet({
//   contentSecurityPolicy: false
// }));

// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());

// dotenv.config();


// // app.use(express.json());

// app.use(helmet({ contentSecurityPolicy: false }));

// app.use('/user',userRouter);

// app.use('/expense', expenseRoutes);

// app.use('/payment', purchase)



// // One to Many Relationship
// User.hasMany(Expense);
// Expense.belongsTo(User);

// // Relationship between User and Order
// // User.hasMany(Order);
// // Order.belongsTo(User);

// User.hasMany(Order, { foreignKey: 'userId' });
// Order.belongsTo(User, { foreignKey: 'userId' });
require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./util/database');

const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const userRouter = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchaseRoutes'); // Import purchase routes

const User = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/orders');

// Middleware
dotenv.config();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/user', userRouter);
app.use('/expense', expenseRoutes);
app.use('/payment', purchaseRoutes); // Use the purchase router here

// Define relationships
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });


sequelize
    .sync()

    .then(result=>{
        app.listen(3001);
    })
    .catch(err=>console.log(err)); 