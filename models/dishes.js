import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish should have a name"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Dish should have a creator"],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Dish should have an updater"],
    },
    recipe: {
      type: String,
    },
    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.ObjectId,
          ref: "Ingredients",
          required: [true, "Ingredient is required"],
        },
        measurement_unit: {
          type: String,
          enum: ["cup", "tablespoon", "teaspoon", "gm", "ml", "number"],
          required: [true, "Ingredient should have a measurement unit."],
        },
        amount: {
          type: Number,
          required: [true, "Ingredient should have an amount."],
        },
        to: {
          type: Number,
          validate: {
            validator: function (value) {
              return value == null || value > this.amount;
            },
            message: "'to' should be greater than 'amount'.",
          },
        },
        isOptional: {
          type: Boolean,
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
