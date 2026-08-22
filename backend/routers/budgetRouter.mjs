import express from 'express'
import Budget from '../models/BudgetSchema.mjs'

const budgetRouter = express.Router();

budgetRouter.post('/',async(req, res)=>{
    try {
        const {userId, categoryId, maxAmount, month} = req.body;
        const budgetObject = new Budget({userId, categoryId, maxAmount, month});
        await budgetObject.save();
        res.status(201).json(budgetObject);
    } catch (error) {
        res.status(500).json({message: "Error Occured", error: error.message});
    }
});

budgetRouter.get('/:userId', async(req,res)=>{
    try {
        const {userId} = req.params;
        const userBudget = await Budget.find({userId:userId});
        res.status(201).json(userBudget);
    } catch (error) {
        res.status(500).json({message: "Error Occured", error: error.message});
    }
})

// 🗑️ Delete Specific Budget Plan Template by ID Endpoint Route
budgetRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBudget = await Budget.findByIdAndDelete(id);
        
        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget layout plan sheet not found." });
        }
        res.status(200).json({ message: "Budget target configuration deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurred", error: error.message });
    }
});


export default budgetRouter;