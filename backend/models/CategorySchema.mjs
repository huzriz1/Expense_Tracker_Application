import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;