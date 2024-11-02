import Ingredients from "../models/ingredients.js";

export async function getAllIngredients(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Ingredients.find(filter, {}, { skip: limit * (page - 1), limit })
      .populate("createdBy", "name fName lName")
      .populate("updatedBy", "name fName lName");
    const countPromise = Ingredients.countDocuments(filter);
    const [ingredients, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: ingredients, count });
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
    const { body, user } = req;
    body.createdBy = user._id;
    body.updatedBy = user._id;

    const ingredient = await Ingredients.create(body);

    res.status(201).json({ data: ingredient });
  } catch (error) {
    next(error);
  }
}

export async function updateIngredient(req, res, next) {
  try {
    const { id } = req.params;
    const { body, user } = req;
    body.updatedBy = user._id;

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
