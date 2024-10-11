import { FetchSubSpeciesUseCase } from '../../usecases/FetchSubSpeciesUseCase';
import { Request, Response } from 'express';

export class SubSpeciesController {
  constructor(private fetchSubSpeciesUseCase: FetchSubSpeciesUseCase) {}

  async getSubSpecies(_req: Request, res: Response) {
    const subSpecies = await this.fetchSubSpeciesUseCase.execute();
    res.status(200).json(subSpecies);
  }
}