import Ingredients from "../models/ingredients.js";

export async function getAllIngredients(req, res, next) {
  try {
    const ingredients = await Ingredients.find();
    res.json({ data: ingredients });
  } catch (error) {
    next(error);
  }
}

export async function getIngredient(req, res, next) {
  try {
    const { id } = req.params;
    const ingredient = await Ingredients.findById(id);
    res.json({ data: ingredient });
  } catch (error) {
    next(error);
  }
}

export async function createIngredient(req, res, next) {
  try {
    const { body } = req;
    // TODO: Update createdBy and updatedBy
    body.createdBy = "Admin";
    body.updatedBy = "Admin";

    const ingredient = await Ingredients.create(body);

    res.status(201).json({ data: ingredient });
  } catch (error) {
    next(error);
  }
}

export async function updateIngredient(req, res, next) {
  try {
    const { id } = req.params;
    const { body } = req;

    const ingredient = await Ingredients.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    res.json({ data: ingredient });
  } catch (error) {
    next(error);
  }
}

export async function deleteIngredient(req, res, next) {
  try {
    const { id } = req.params;

    await Ingredients.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
