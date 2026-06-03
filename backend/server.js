import "dotenv/config";
import express from "express";
import cors from "cors";
import todoRouter from "./routes/todo.js";
import userRouter from "./routes/user.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Allow all origins by default; set CORS_ORIGIN (comma-separated) to lock down in production.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : "*";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Health check for load balancers / container orchestrators.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//client ----> middleware---> Main logic --->Response
app.use("/todos",  verifyToken, todoRouter);
app.use("/users",  verifyToken, userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
