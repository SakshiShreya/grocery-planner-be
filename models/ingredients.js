import mongoose from "mongoose";

const ingredientsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient should have a name"]
    },
    createdBy: {
      type: String,
      required: [true, "Ingredient should have a creator"]
    },
    updatedBy: {
      type: String,
      required: [true, "Ingredient should have a updater"]
    },
    preparations: [
      {
        category: {
          type: String,
          required: [true, "Preparation should have a category"]
        },
        timeAount: {
          type: Number,
          required: [true, "Preparation should have a time"]
        },
        timeUnits: {
          type: String,
          required: [true, "Preparation should have a time unit"],
          enum: ["minutes", "hours", "days"],
          default: "days"
        }
      }
    ]
  },
  { timestamps: true }
);

ingredientsSchema.index({ name: 1 });

const Ingredients = mongoose.model("Ingredients", ingredientsSchema);

export default Ingredients;
