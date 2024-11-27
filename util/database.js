const Sequelize=require('sequelize').Sequelize;

// const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
//     dialect: 'mysql',
//     host: process.env.DB_HOST,
//     define: {
//         timestamps: false,
//       }
// });


const sequelize = new Sequelize('expense_tracker', 'root', '9695482755Roh@n', {
  host: 'localhost', // The database host
  dialect: 'mysql',  // Use the appropriate dialect (e.g., mysql, postgres)
});



module.exports=sequelize;