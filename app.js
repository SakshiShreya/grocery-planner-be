import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import ingredients from "./routes/ingredients.js";
import dishes from "./routes/dishes.js";
import users from "./routes/users.js";
import plans from "./routes/plans.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import verifyToken from "./utils/verifyToken.js";

const app = express();

// MIDDLEWARES

// 1. Logging
app.use(morgan("dev"));

// 2. CORS issue
app.use(cors());

// 3. Rate limiting
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 20,
    message: { message: "You are rate limited! Please try after 10 min." },
    standardHeaders: true,
    legacyHeaders: false
  })
);

// 4. Get body
app.use(express.json({ limit: "1mb" }));

// 5. Compress api response
app.use(compression());

// 6. Routes
app.use("/auth", users);

app.use(verifyToken);
// private routes
app.use("/api/ingredients", ingredients);
app.use("/api/dishes", dishes);
app.use("/api/plans", plans);

app.all("*", (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

app.use(globalErrorHandler);

// EXPORT
export default app;
