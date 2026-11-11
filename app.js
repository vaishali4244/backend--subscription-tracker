import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded request bodies and false extended option to parse simple key-value pairs

app.use(cookieParser()); // reads cookies from the request headers and populates the req.cookies object with key-value pairs representing the cookies sent by the client.

//route - api/v1/auth/sign-up
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware); // Use the error handling middleware

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API");
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToDatabase();
});

export default app;
