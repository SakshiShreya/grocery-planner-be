import express from "express";
import { createPlan, getAllPlans, getPlan } from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans).post(createPlan);
router.route("/:id").get(getPlan);

export default router;
