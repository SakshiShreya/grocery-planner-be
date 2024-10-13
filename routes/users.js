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
    const payload = ticket.getPayload();

    let user = await Users.findOne({ email: payload.email });
    if (!user) {
      user = await Users.create({
        email: payload.email,
        name: payload.name,
        authSource: "google"
      });
    }

    const token = jwt.sign({ user }, JWT_SECRET);

    res.status(200).json({ data: payload, jwt: token });
  } catch (e) {
    res.status(400).json({ msg: err });
  }
});

export default router;
