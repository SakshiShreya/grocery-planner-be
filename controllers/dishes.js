import Dishes from "../models/dishes.js";

export async function getAllDishes(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Dishes.find(
      filter,
      {},
      { skip: limit * (page - 1), limit }
    )
      .populate("ingredients.ingredient")
      .populate("createdBy", "name fName lName")
      .populate("updatedBy", "name fName lName");
    const countPromise = Dishes.countDocuments(filter);
    const [dishes, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: dishes, count });
  } catch (error) {
    next(error);
  }
}

export async function getDish(req, res, next) {
  try {
    const { id } = req.params;
    const dish = await Dishes.findById(id);
    res.json({ data: dish });
  } catch (error) {
    next(error);
  }
}

export async function createDish(req, res, next) {
  try {
    const { body, user } = req;
    body.createdBy = user._id;
    body.updatedBy = user._id;

    const dish = await Dishes.create(body);

    res.status(201).json({ data: dish });
  } catch (error) {
    next(error);
  }
}

export async function updateDish(req, res, next) {
  try {
    const { id } = req.params;
    const { body, user } = req;
    body.updatedBy = user._id;

    const dish = await Dishes.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.json({ data: dish });
  } catch (error) {
    next(error);
  }
}

export async function deleteDish(req, res, next) {
  try {
    const { id } = req.params;
    await Dishes.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
