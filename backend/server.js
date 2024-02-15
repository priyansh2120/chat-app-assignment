import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMonogoDB.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
// to parse the incoming request with JSON payloads from req.body

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World its 4 am");
// });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
