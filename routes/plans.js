import express from "express";
import { createPlan, getAllPlans, getPlan, updateMeal } from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:id").get(getPlan);
router.route("/:id/meals").post(updateMeal);

export default router;
