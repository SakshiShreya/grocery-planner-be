import express from "express";
import {
  createPlan,
  deleteMeal,
  deletePlan,
  getAllPlans,
  getPlan,
  updateMeal,
  updatePlan,
} from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:id").get(getPlan).patch(updatePlan).delete(deletePlan);
router.route("/:id/meals").post(updateMeal);
router.route("/:id/meals/:mealId").delete(deleteMeal);

export default router;
