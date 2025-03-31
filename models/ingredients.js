import mongoose from "mongoose";

const ingredientsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient should have a name"]
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Ingredient should have a creator"]
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Ingredient should have an updater"]
    },
    preparations: [
      {
        category: {
          type: String,
          enum: [
            "Baked",
            "Boiled",
            "Chopped",
            "Diced",
            "Dried",
            "Fermented",
            "Fried",
            "Frosted",
            "Grated",
            "Grilled",
            "Ground",
            "Kneaded",
            "Marinated",
            "Roasted",
            "Sauteed",
            "Shredded",
            "Sliced",
            "Smoked",
            "Soaked",
            "Steamed",
            "Stir-fried",
            "Stuffed",
            "Toasted",
            "Whipped"
          ],
          required: [true, "Preparation should have a category"]
        },
        timeAmount: {
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
