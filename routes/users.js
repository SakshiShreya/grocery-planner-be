import express from "express";
import { authenticateByGoogle, loginByEmail, signupByEmail } from "../controllers/users.js";

const router = express.Router();

router.route("/google").post(authenticateByGoogle);
router.route("/signup").post(signupByEmail);
router.route("/login").post(loginByEmail);

export default router;
