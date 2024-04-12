const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");

const app = express();

// MIDDLEWARES

// 1. Logging
app.use(morgan("dev"));

// 2. CORS issue
app.use(cors());

// 3. Get body
app.use(express.json());

// 4. Compress api response
app.use(compression());

// 6. Routes
app.get("/api/users", (req, res) => {
  res.json({ a: "a", b: "b" });
});

app.get("/api", (req, res) => {
  res.json({ message: "User created successfully" });
});

// EXPORT
module.exports = app;
