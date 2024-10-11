import { Router, Request, Response } from "express";
import { FetchCharClassesUseCase } from "./usecases/FetchCharClassesUseCase";
import { DndApiCharClassRepository } from "./infrastructure/repositories/DndApiCharClassesRepository";

export const dndRouter = Router();

const charClassRepository = new DndApiCharClassRepository();
const fetchCharClassesUseCase = new FetchCharClassesUseCase(charClassRepository);

dndRouter.get("/classes", async (_request: Request, response: Response) => {
  try {
    const classes = await fetchCharClassesUseCase.execute();
    response.status(200).json(classes);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
});