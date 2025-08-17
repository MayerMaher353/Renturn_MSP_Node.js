const express= require('express');
const app = express();
app.use(express.json());
const dotenv= require ("dotenv");
const connectDB= require('./config/Data_Connection')
connectDB();











app.listen(process.env.PORT||5000,()=>{
    console.log('running')
})