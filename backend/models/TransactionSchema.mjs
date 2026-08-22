import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
  type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    }
});

const Transaction = mongoose.model('Transaction',TransactionSchema);
export default Transaction;