import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

import app from "./app.js";

// CONNECT MONGO
const DB = process.env.DB;
console.log({ DB });
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${PORT}...`);
});
