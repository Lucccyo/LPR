import express from 'express';

import { SpeciesController } from './interfaces/controllers/SpeciesController';
import { DndApiSpeciesRepository } from './infrastructure/repositories/DndApiSpeciesRepository';
import { FetchSpeciesUseCase } from './usecases/FetchSpeciesUseCase';

import { ApiController } from './interfaces/controllers/apiController';

export function createDndRouter(): express.Router {
  const router = express.Router();

  const speciesRepository = new DndApiSpeciesRepository();
  const fetchSpeciesUseCase = new FetchSpeciesUseCase(speciesRepository);
  const speciesController = new SpeciesController(fetchSpeciesUseCase);

  const apiController = new ApiController();

  router.get('/species', async (_request, response) => {
    try {
      const result = await speciesController.getSpecies(_request, response);
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.get('/all', async (_request, response) => {
    try {
      const result = await apiController.fetchAllApi();
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  return router;
}

function handleError(error: unknown, response: express.Response): void {
  console.error('Error in DnD router:', error);
  if (error instanceof Error) {
    response.status(500).json({ error: error.message });
  } else {
    response.status(500).json({ error: 'An unexpected error occurred' });
  }
}