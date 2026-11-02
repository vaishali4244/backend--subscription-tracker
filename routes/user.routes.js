import { Router } from "express";

const userRouter = Router();

userRouter.get("/user", (req, res) => {
  res.send({ message: "GET all users" });
});

userRouter.get("/user/:id", (req, res) => {
  res.send({ message: "get user details" });
});

userRouter.post("/user", (req, res) => {
  res.send({ message: "create user" });
});
userRouter.put("/user/:id", (req, res) => {
  res.send({ message: "update user" });
});

userRouter.delete("/user/:id", (req, res) => {
  res.send({ message: "delete user" });
});

export default userRouter;
