import Plans from "../models/plans.js";

export async function getAllPlans(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Plans.find(
      filter,
      {},
      { skip: limit * (page - 1), limit },
    ).populate("updatedBy", "name fName lName");
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
    const plan = await Plans.findById(id).populate({
      path: "meals.dishes.dish",
      select: "name",
    });
    const planJSON = plan.toJSON();

    const groupedByDay = planJSON.meals.reduce((acc, item) => {
      const { day } = item;
      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(item);
      return acc;
    }, {});

    res.json({ data: { ...planJSON, meals: groupedByDay } });
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

export async function updatePlan(req, res, next) {
   try {
    const { id } = req.params;
    const { body, user } = req;
    body.updatedBy = user._id;

    const ingredient = await Plans.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    res.json({ data: ingredient });
  } catch (error) {
    next(error);
  }
}

export async function deletePlan(req, res, next) {
  try {
    const { id } = req.params;

    await Plans.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function updateMeal(req, res, next) {
  try {
    const { id } = req.params;
    const { body, user } = req;
    const { day, mealType, dishes } = body;

    // Try to update existing meal with matching day + mealType
    const updatedPlan = await Plans.findOneAndUpdate(
      { _id: id, "meals.day": day, "meals.mealType": mealType },
      {
        updatedBy: user._id,
        $set: { "meals.$.dishes": dishes },
      },
      { new: true, runValidators: true }
    );

    // If no matching meal found, push a new one
    if (!updatedPlan) {
      const plan = await Plans.findByIdAndUpdate(
        id,
        {
          updatedBy: user._id,
          $push: { meals: body },
        },
        { new: true, runValidators: true }
      );
      return res.json({ data: plan });
    }

    res.json({ data: updatedPlan });
  } catch (error) {
    next(error);
  }
}
