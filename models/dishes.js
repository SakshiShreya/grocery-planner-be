import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish should have a name"],
    },
    createdBy: {
      type: String,
      required: [true, "Dish should have a creator"],
    },
    updatedBy: {
      type: String,
      required: [true, "Dish should have a updater"],
    },
    recipe: {
      type: String,
      required: [false],
    },
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.ObjectId, ref: "Ingredients", required: [true, "Ingredient is required"] },
        measurement_unit: {
          type: String,
          enum: ["cup", "tablespoon", "teaspoon", "gm", "ml"],
          required: [true, "Ingredient should have a measurent unit."],
        },
        amount: {
          type: Number,
          required: [true, "Ingredient should have an amount."],
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

dishesSchema.index({ name: 1 });

const Dishes = mongoose.model("Dishes", dishesSchema);

export default Dishes;
