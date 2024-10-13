import dotenv from "dotenv";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import Users from "../models/users.js";

dotenv.config({ path: "./config.env" });
const router = express.Router();
const client = new OAuth2Client();
const { JWT_SECRET } = process.env;

router.post("/google", async (req, res) => {
  const { credential, clientId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId
    });
    const { email, given_name, family_name, picture } = ticket.getPayload();

    let user = await Users.findOne({ email });
    if (!user) {
      user = await Users.create({
        email,
        fName: given_name,
        lName: family_name,
        picture,
        authSource: "google"
      });
    }

    user = user.toJSON();
    delete user.password;
    delete user.__v;

    const token = jwt.sign({ user }, JWT_SECRET);
    res.status(200).json({ data: user, jwt: token });
  } catch (e) {
    res.status(400).json({ msg: err });
  }
});

export default router;
