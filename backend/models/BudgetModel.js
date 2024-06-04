import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
    },
    categories: [{
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            default: 0,
        },
    }],
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
