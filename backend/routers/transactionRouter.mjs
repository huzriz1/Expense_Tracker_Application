import express from 'express';
import Transaction from '../models/TransactionSchema.mjs';

const transactionRouter = express.Router();

transactionRouter.post('/', async(req,res)=>{
    try {
        const {userId, categoryId, amount, date, note, type} = req.body;
        const transactionObject = new Transaction({userId, categoryId, amount, date, note, type});
        await transactionObject.save();
        // res.status(201).json({message: "Transaction saved", data: transactionObject});
        res.status(201).json({ message: "Transaction saved", data: transactionObject });

    } catch (error) {
        res.status(500).json({message: "Error Occured", error: error.message});
    }
})

transactionRouter.get('/:userId', async(req, res)=>{
    try {
        const {userId} = req.params;
        const userTransaction = await Transaction.find({userId:userId}).sort({date:-1 });
        res.status(200).json(userTransaction);
    } catch (error) {
        res.status(500).json({message: "Error Occured", error: error.message});
    }
})

// 🗑️ Delete Specific Transaction by ID Endpoint Route
transactionRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction record not found in MongoDB." });
        }
        res.status(200).json({ message: "Transaction successfully erased from database" });
    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurred", error: error.message });
    }
});


export default transactionRouter;