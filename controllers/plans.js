import Plans from "../models/plans.js";
import Users from "../models/users.js";

export async function getAllPlans(req, res, next) {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const filter = { name: { $regex: q, $options: "i" } };
    const findPromise = Plans.find(filter, {}, { skip: limit * (page - 1), limit }).populate(
      "updatedBy",
      "name fName lName",
    );
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

export async function startPlan(req, res, next) {
  try {
    const { id } = req.params;
    const { weeks } = req.body;
    const { user } = req;

    if (weeks == null) {
      throw { statusCode: 400, message: "Plan duration (weeks) is required" };
    }

    if (!Number.isInteger(weeks)) {
      throw { statusCode: 400, message: "Plan duration must be a whole number of weeks" };
    }

    const plan = await Plans.findById(id).select("_id name isPrivate createdBy");
    if (!plan) {
      throw { statusCode: 404, message: "Plan not found" };
    }

    if (plan.isPrivate && plan.createdBy.toString() !== user._id.toString()) {
      throw { statusCode: 403, message: "You don't have permission to start this plan" };
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);

    await Users.findByIdAndUpdate(
      user._id,
      {
        currentPlan: {
          plan: plan._id,
          weeks,
          startedAt,
          endsAt,
        },
      },
      { new: true, runValidators: true },
    );

    const updatedUser = await Users.findById(user._id).populate("currentPlan.plan", "name");
    const userData = updatedUser.toJSON();
    delete userData.password;
    delete userData.__v;

    res.json({ data: userData });
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
      { new: true, runValidators: true },
    );

    // If no matching meal found, push a new one
    if (!updatedPlan) {
      const plan = await Plans.findByIdAndUpdate(
        id,
        {
          updatedBy: user._id,
          $push: { meals: body },
        },
        { new: true, runValidators: true },
      );
      return res.json({ data: plan });
    }

    res.json({ data: updatedPlan });
  } catch (error) {
    next(error);
  }
}

export async function deleteMeal(req, res, next) {
  try {
    const { id, mealId } = req.params;

    await Plans.findByIdAndUpdate(id, {
      $pull: {
        meals: { _id: mealId },
      },
    });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
