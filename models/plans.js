import mongoose from "mongoose";

const plansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan should have a name"]
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Plan should have a creator"]
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "Plan should have an updater"]
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    meals: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          required: [true, "Day is required"]
        },
        mealType: {
          type: String,
          enum: ["wakeup", "breakfast", "midmorning", "lunch", "midafternoon", "dinner", "bedtime"],
          required: [true, "Meal type is required"]
        },
        dishes: [{ dish: { type: mongoose.Schema.ObjectId, ref: "Dishes", required: [true, "Dish is required"] } }]
      }
    ]
  },
  { timestamps: true }
);

plansSchema.index({ name: 1 });

const Plans = mongoose.model("Plans", plansSchema);

export default Plans;
