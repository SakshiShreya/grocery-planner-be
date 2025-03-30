import mongoose from "mongoose";

const plansSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan should have a name"]
    }
  },
  { timestamps: true }
);

plansSchema.index({ name: 1 });

const Plans = mongoose.model("Plans", plansSchema);

export default Plans;
