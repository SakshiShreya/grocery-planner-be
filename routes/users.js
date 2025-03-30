import express from "express";
import { authenticateByGoogle, changePassword, editUserDetails, loginByEmail, signupByEmail } from "../controllers/users.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.route("/google").post(authenticateByGoogle);
router.route("/signup").post(signupByEmail);
router.route("/login").post(loginByEmail);

// private routes
router.use(verifyToken);
router.route("/change-password").post(changePassword);
router.route("/edit").put(editUserDetails);

export default router;
