import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish should have a name"]
    },
    createdBy: {
      type: String,
      required: [true, "Dish should have a creator"]
    },
    updatedBy: {
      type: String,
      required: [true, "Dish should have a updater"]
    },
    recipe: {
        type: String,
        required: [false]
    },
    ingredients: [
        {
            name: {
                type: String,
                required: [true, "Ingredient should have a name."]
            },
            measurement_unit: {
                type: String,
                enum: ["cup", "tablespoon", "teaspoon", "g", "ml"],
                required: [true, "Ingredient should have a measurent unit."]
            },
            amount: {
                type: Int16Array,
                required: [true, "Ingredient should have an amount."]
            }
        }
    ],
    isPublic: {
        type: bool,
        required: [true, "Dish should indicate whether the author wants it visible to all users."]
    },
  },
  { timestamps: true }
);

dishesSchema.index({ name: 1 });

const Dishes = mongoose.model("Dishes", dishesSchema);

export default Dishes;
