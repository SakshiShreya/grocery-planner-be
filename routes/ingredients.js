import express from "express";
import { getAllIngredients, createIngredient, getIngredient, updateIngredient, deleteIngredient } from "../controllers/ingredients.js";

const router = express.Router();

router.route("/").get(getAllIngredients).post(createIngredient);
router.route("/:id").get(getIngredient).patch(updateIngredient).delete(deleteIngredient);

export default router;
