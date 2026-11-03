import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ message: "GET all subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => {
  res.send({ message: "GET subscription by ID" });
});
subscriptionRouter.post("/", (req, res) => {
  res.send({ message: "create new subscription" });
});
subscriptionRouter.put("/:id", (req, res) => {
  res.send({ message: "update a subscriptions" });
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ message: "delete a subscription" });
});
subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({ message: "GET subscriptions for a user" });
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ message: "cancel a subscription" });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ message: "GET upcoming renewal subscriptions" });
});

export default subscriptionRouter;
