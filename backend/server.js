import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import validateToken from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_SERVICE,
    credentials: true,
  })
);
app.use(cookieParser());
const port = process.env.PORT;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_STRING);
  console.log("db connected");
}

app.use(express.json());
app.use("/api/users", authRoute);
app.use("/api/posts", postRoute);
// for navbar
app.get("/api/users/me", validateToken, (req, res) => {
  res.json(req.data);
});

app.listen(port, () => {
  console.log(`assesment app listening on port ${port}`);
});
