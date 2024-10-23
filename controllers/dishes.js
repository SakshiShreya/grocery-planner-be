import Dishes from "../models/dishes.js";

export async function getAllDishes(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Dishes.find(filter, {}, { skip: limit * (page - 1), limit }).populate(
      "ingredients.ingredient",
    );
    const countPromise = Dishes.countDocuments(filter);
    const [dishes, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: dishes, count });
  } catch (error) {
    next(error);
  }
}

export async function createDish(req, res, next) {
  try {
    const { body } = req;
    // TODO: Update createdBy and updatedBy
    body.createdBy = "Admin";
    body.updatedBy = "Admin";

    const dish = await Dishes.create(body);

    res.status(201).json({ data: dish });
  } catch (error) {
    next(error);
  }
}

export async function updateDish(req, res, next) {
  try {
    const { id } = req.params;
    const { body } = req;

    const dish = await Dishes.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.json({ data: dish });
  } catch (error) {
    next(error);
  }
}
