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
    } else {
      // check what is missing and update user info
      if (!user.fName) {
        user.fName = given_name;
      }
      if (!user.lName) {
        user.lName = family_name;
      }
      if (!user.picture) {
        user.picture = picture;
      }
      user = await Users.findByIdAndUpdate(user._id, user);
    }

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(200).json({ data: user, jwt: token });
  } catch (e) {
    const error = { statusCode: 400, message: e.message || e };
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
    const error = { statusCode: e.statusCode || 400, message: e.message || e };
    next(error);
  }
}

export async function loginByEmail(req, res, next) {
  const { JWT_SECRET } = process.env;
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ email: { $eq: email } });

    if (user && user.authSource === "nonEmail") {
      const error = { statusCode: 400, message: "User exists with google account" };
      throw error;
    }

    if (!user) {
      const error = { statusCode: 401, message: "Invalid credentials" };
      throw error;
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      const error = { statusCode: 401, message: "Invalid credentials" };
      throw error;
    }

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(200).json({ data: user, jwt: token });
  } catch (e) {
    const error = { statusCode: e.statusCode || 400, message: e.message || e };
    next(error);
  }
}

export async function changePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  const { user } = req;

  try {
    const isCurrentPassEqual = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPassEqual) {
      const error = { statusCode: 400, message: "Current password is wrong" };
      throw error;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.findByIdAndUpdate(user._id, { password: newHashedPassword });

    const data = { message: "Password changed successfully" };
    res.status(200).json(data);
  } catch (e) {
    const error = { statusCode: e.statusCode || 400, message: e.message || e };
    next(error);
  }
}

export async function editUserDetails(req, res, next) {
  const { firstName, lastName, oldEmail, email, picture } = req.body;

  if (
    (firstName && typeof firstName !== "string") ||
    (lastName && typeof lastName !== "string") ||
    (email && typeof email !== "string") ||
    (picture && typeof picture !== "string")
  ) {
    const error = { statusCode: 400, message: "Invalid input" };
    throw error;
  }

  try {
    let user = await Users.findOne({ email: { $eq: oldEmail } });
    if (!user) {
      const error = { statusCode: 401, message: "Invalid credentials" };
      throw error;
    }

    const updateData = {};
    if (firstName) updateData.fName = firstName;
    if (lastName) updateData.lName = lastName;
    if (email) updateData.email = email;
    updateData.picture = picture; // optional field

    user = await Users.findByIdAndUpdate(user._id, { $set: updateData }, { new: true });

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const data = { message: "User details updated successfully", data: user };
    res.status(200).json(data);
  } catch (e) {
    const error = { statusCode: e.statusCode || 400, message: e.message || e };
    next(error);
  }
}
