import express from "express";
import { getAllDishes } from "../controllers/dishes.js";

const router = express.Router();

router.route("/").get(getAllDishes);

export default router;
