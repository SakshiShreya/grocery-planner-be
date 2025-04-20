import express from "express";
import {
  createDish,
  getAllDishes,
  updateDish,
  deleteDish,
} from "../controllers/dishes.js";

const router = express.Router();

router.route("/").get(getAllDishes).post(createDish);
router.route("/:id").patch(updateDish).delete(deleteDish);

export default router;
