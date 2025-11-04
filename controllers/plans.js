import Plans from "../models/plans.js";

export async function getAllPlans(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Plans.find(filter, {}, { skip: limit * (page - 1), limit });
    const countPromise = Plans.countDocuments(filter);
    const [plans, count] = await Promise.all([findPromise, countPromise]);
    res.json({ data: plans, count });
  } catch (error) {
    next(error);
  }
}

export async function getPlan(req, res, next) {
  try {
    const { id } = req.params;
    const plan = await Plans.findById(id);
    const planJSON = plan.toJSON();

    const groupedByDay = planJSON.meals.reduce((acc, item) => {
      const {day} = item;
      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(item);
      return acc;
    }, {});

    res.json({ data: {...planJSON, meals: groupedByDay} });
  } catch (error) {
    next(error);
  }
}

export async function createPlan(req, res, next) {
  try {
    const { body, user } = req;
    body.createdBy = user._id;
    body.updatedBy = user._id;

    const plan = await Plans.create(body);

    res.status(201).json({ data: plan });
  } catch (error) {
    next(error);
  }
}

export async function createMeal(req, res, next) {
  try {
    const { id } = req.params;
    const { body, user } = req;

    const planBody = {
      updatedBy: user._id,
      $push: { meals: body }
    };

    const plan = await Plans.findByIdAndUpdate(id, planBody, {
      new: true,
      runValidators: true,
    });

    res.json({ data: plan });
  } catch (error) {
    next(error);
  }
}
