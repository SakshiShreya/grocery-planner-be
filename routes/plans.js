import express from "express";
import {
  createMeal,
  createPlan,
  deletePlan,
  getAllPlans,
  getPlan,
} from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:id").get(getPlan).delete(deletePlan);
router.route("/:id/meals").post(createMeal);

export default router;
