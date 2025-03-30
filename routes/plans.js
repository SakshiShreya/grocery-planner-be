import express from "express";
import { getAllPlans } from "../controllers/plans.js";

const router = express.Router();

router.route("/").get(getAllPlans);

export default router;
