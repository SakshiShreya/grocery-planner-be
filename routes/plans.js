import express from "express";
import {
  createPlan,
  deleteMeal,
  deletePlan,
  getAllPlans,
  getPlan,
  startPlan,
  stopPlan,
  updateMeal,
} from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:id").get(getPlan).delete(deletePlan);
router.route("/:id/meals").post(updateMeal);
router.route("/:id/meals/:mealId").delete(deleteMeal);
router.route("/:id/start").post(startPlan);
router.route("/:id/stop").post(stopPlan);

export default router;
