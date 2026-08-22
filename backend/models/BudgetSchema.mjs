import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
