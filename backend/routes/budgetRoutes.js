import express from 'express';
import { addBudgetController, deleteBudgetController, getAllBudgetController, updateBudgetController } from '../controllers/budgetController.js';

const router = express.Router();

router.route("/addBudget").post(addBudgetController);

router.route("/getBudget").post(getAllBudgetController);

router.route("/deleteBudget/:id").post(deleteBudgetController);

router.route('/updateBudget/:id').put(updateBudgetController);

export default router;
