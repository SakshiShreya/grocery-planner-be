import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import ingredients from "./routes/ingredients.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";

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
    message: { msg: "You are rate limited! Please try after 10 min." },
    standardHeaders: true,
    legacyHeaders: false
  })
);

// 4. Get body
app.use(express.json());

// 5. Compress api response
app.use(compression());

// 6. Routes
app.use("/api/ingredients", ingredients);

app.all("*", (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

app.use(globalErrorHandler);

// EXPORT
export default app;
