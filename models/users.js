import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "User should have an email"],
      unique: [true, "User with this email already exists"],
    },
    fName: {
      type: String,
      required: [true, "User should have a first name"],
    },
    lName: String,
    password: String,
    picture: String,
    currentPlan: {
      plan: {
        type: mongoose.Schema.ObjectId,
        ref: "Plans",
        required: function () {
          return this.currentPlan && (this.currentPlan.startedAt || this.currentPlan.endsAt);
        },
      },
      startedAt: {
        type: Date,
        required: function () {
          return this.currentPlan && this.currentPlan.plan;
        },
      },
      endsAt: {
        type: Date,
        required: function () {
          return this.currentPlan && this.currentPlan.plan;
        },
      },
    },
    authSource: {
      type: String,
      enum: ["email", "nonEmail"],
      default: "email",
    },
  },
  { toJSON: { virtuals: true } },
);

usersSchema.virtual("name").get(function () {
  return `${this.fName} ${this.lName}`;
});

const Users = mongoose.model("Users", usersSchema);

export default Users;
