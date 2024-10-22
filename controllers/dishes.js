import Dishes from "../models/dishes.js";

export async function getAllDishes(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } }
    const findPromise = Dishes.find(filter, {}, { skip: limit * (page - 1), limit });
    const countPromise = Dishes.countDocuments(filter);
    const [dishes, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: dishes, count });
  } catch (error) {
    next(error);
  }
}