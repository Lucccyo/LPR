import { FetchSpeciesUseCase } from "../../usecases/FetchSpeciesUseCase";
import { Request, Response } from "express";

export class SpeciesController {
  constructor(private fetchSpeciesUseCase: FetchSpeciesUseCase) {}

  async getSpecies(_req: Request, res: Response) {
    const species = await this.fetchSpeciesUseCase.execute();
    res.status(200).json(species);
  }
}
