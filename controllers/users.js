import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import Users from "../models/users.js";

dotenv.config({ path: "./config.env" });

export async function authenticateByGoogle(req, res, next) {
  const client = new OAuth2Client();
  const { JWT_SECRET } = process.env;

  const { credential, clientId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId
    });
    const { email, given_name, family_name, picture } = ticket.getPayload();

    let user = await Users.findOne({ email: { $eq: email } });
    if (!user) {
      user = await Users.create({
        email,
        fName: given_name,
        lName: family_name,
        picture,
        authSource: "nonEmail"
      });
    }

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(200).json({ data: user, jwt: token });
  } catch (e) {
    const error = { statusCode: 401, message: e.message || e };
    next(error);
  }
}

export async function signupByEmail(req, res, next) {
  const { JWT_SECRET } = process.env;
  const { email, password, firstName, lastName } = req.body;

  if (typeof firstName !== "string" || typeof lastName !== "string") {
    const error = { statusCode: 400, message: "Invalid input" };
    throw error;
  }

  try {
    let user = await Users.findOne({ email: { $eq: email } });

    if (user && user.authSource === "email") {
      const error = { statusCode: 400, message: "User already exists" };
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (user && user.authSource === "nonEmail") {
      user = await Users.findByIdAndUpdate(
        user._id,
        { password: hashedPassword, fName: firstName, lName: lastName, authSource: "email" },
        { new: true }
      );
    } else {
      user = await Users.create({ email, password: hashedPassword, fName: firstName, lName: lastName, authSource: "email" });
    }

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(201).json({ data: user, jwt: token });
  } catch (e) {
    const error = { statusCode: e.statusCode || 401, message: e.message || e };
    next(error);
  }
}
