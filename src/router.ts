import { Router, Request, Response } from "express";

export const router = Router();

router.get("/", (_request: Request, response: Response) => {
  response.json({
    message: "OK"
  })
});
