import { Request, Response, Router } from "express";
import fetch from "node-fetch";
import { calculateMeanTimes } from "../controller/task.controller";
import { labelRouter } from "./label.router";
import { taskRouter } from "./task.router";
import { trackingRouter } from "./tracking.router";

export const globalRouter = Router({ mergeParams: true });

globalRouter.get("/", async (_: Request, res: Response) => {
  res.send({ message: "Hello, this is the time tracker api by 760212" });
});

globalRouter.get("/motivation", async (_: Request, res: Response) => {
  const response = await fetch("https://zenquotes.io/api/random", {
    method: "GET",
  });

  const quote = await response.json();
  console.log(quote);
  res.send({ quote: quote[0].q, person: quote[0].a });
});

globalRouter.get('/stats', calculateMeanTimes);

globalRouter.use("/task", taskRouter);
globalRouter.use("/label", labelRouter);
globalRouter.use("/tracking", trackingRouter);
