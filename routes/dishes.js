import express from "express";
import { createDish, getAllDishes, updateDish } from "../controllers/dishes.js";

const router = express.Router();

router.route("/").get(getAllDishes).post(createDish);
router.route("/:id").patch(updateDish);

export default router;
