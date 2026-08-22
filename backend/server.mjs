import 'dotenv/config'; // 🎯 Yeh line aapki .env file ko server ke shuru hote hi load kar degi
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import connectDB from './controllers/connectDB.mjs';
import categoryRouter from './routers/categoryRouter.mjs';
import transactionRouter from './routers/transactionRouter.mjs';
import budgetRouter from './routers/budgetRouter.mjs';
import cors from 'cors'


const app = express();
const PORT = process.env.PORT || 3000;
connectDB()

app.use(cors())
app.use(express.json());
app.use('/api/category', categoryRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/budget', budgetRouter);


app.get('/',(req,res)=>{
    res.send({name: "Huzaifa", age: 19});
})


app.listen(PORT, ()=>console.log(`App is running on port ${PORT}, ${process.env.PORT}`));