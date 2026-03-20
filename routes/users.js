import express from "express";
import { authenticateByGoogle, changePassword, editUserDetails, getUserDetails, loginByEmail, signupByEmail } from "../controllers/users.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.route("/google").post(authenticateByGoogle);
router.route("/signup").post(signupByEmail);
router.route("/login").post(loginByEmail);

// private routes
router.use(verifyToken);
router.route("/change-password").post(changePassword);
router.route("/edit").put(editUserDetails);
router.route("/:id").get(getUserDetails);

export default router;
