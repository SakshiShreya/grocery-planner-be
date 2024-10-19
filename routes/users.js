import dotenv from "dotenv";
import express from "express";
import { authenticateByGoogle, signupByEmail } from "../controllers/users.js";

dotenv.config({ path: "./config.env" });
const router = express.Router();

router.route("/google").post(authenticateByGoogle);
router.route("/signup").post(signupByEmail);

export default router;
