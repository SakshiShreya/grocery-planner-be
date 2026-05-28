import express from "express";
import {
  createDish,
  getAllDishes,
  getDish,
  updateDish,
  deleteDish,
} from "../controllers/dishes.js";

const router = express.Router();

router.route("/").get(getAllDishes).post(createDish);
router.route("/:id").get(getDish).patch(updateDish).delete(deleteDish);

export default router;
