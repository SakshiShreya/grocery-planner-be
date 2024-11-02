import express from "express";
import { getAllIngredients, createIngredient, getIngredient, updateIngredient, deleteIngredient } from "../controllers/ingredients.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.route("/").get(getAllIngredients).post(createIngredient);
router.route("/:id").get(getIngredient).patch(updateIngredient).delete(deleteIngredient);

export default router;
