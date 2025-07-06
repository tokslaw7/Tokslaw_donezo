import express from "express";
import cors from "cors";
import todoRouter from "./routes/todo.js";
import userRouter from "./routes/user.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
//client ----> middleware---> Main logic --->Response
app.use("/todos",  verifyToken, todoRouter);
app.use("/users",  verifyToken, userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});