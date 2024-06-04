import Budget from "../models/BudgetModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addBudgetController = async (req, res) => {
  try {
    const { userId, startDate, endDate, categories } = req.body;

    if (!userId || !startDate || !endDate || !categories) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const newBudget = await Budget.create({
      user: userId,
      startDate: startDate,
      endDate: endDate,
      categories: categories,
    });

    user.budgets.push(newBudget);
    user.save();

    return res.status(200).json({
      success: true,
      message: "Budget added successfully",
      budget: newBudget,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllBudgetController = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const budgets = await Budget.find({ user: userId });

    return res.status(200).json({
      success: true,
      budgets: budgets,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteBudgetController = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const userId = req.body.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the budget by ID
    const budget = await Budget.findByIdAndDelete(budgetId);

    // Check if the budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Remove the budget ID from the user's budgets array
    user.budgets = user.budgets.filter(id => id.toString() !== budgetId);

    // Save the updated user
    await user.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (err) {
    // Return error response
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateBudgetController = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const { startDate, endDate, categories } = req.body;

    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (startDate) {
      budget.startDate = startDate;
    }

    if (endDate) {
      budget.endDate = endDate;
    }

    if (categories) {
      budget.categories = categories;
    }

    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget: budget,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
