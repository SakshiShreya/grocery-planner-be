import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "User should have an email"],
    unique: [true, "User with this email already exists"]
  },
  name: {
    type: String,
    required: [true, "User should have a name"]
  },
  password: String,
  authSource: {
    type: String,
    enum: ["self", "google"],
    default: "self"
  }
});

const Users = mongoose.model("Users", usersSchema);

export default Users;
