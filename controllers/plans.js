import Plans from "../models/plans.js";

export async function getAllPlans(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Plans.find(filter, {}, { skip: limit * (page - 1), limit });
    const countPromise = Plans.countDocuments(filter);
    const [plans, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: plans, count });
  } catch(error) {
    next(error);
  }
}