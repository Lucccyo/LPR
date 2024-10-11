import express from 'express';
import { CharClassController } from './interfaces/controllers/CharClassController';
import { DndApiCharClassRepository } from './infrastructure/repositories/DndApiCharClassesRepository';
import { FetchCharClassesUseCase } from './usecases/FetchCharClassesUseCase';
import { DndApiSubSpeciesRepository } from './infrastructure/repositories/DndApiSubSpeciesRepository';
import { FetchSubSpeciesUseCase } from './usecases/FetchSubSpeciesUseCase';
import { SubSpeciesController } from './interfaces/controllers/SubSpeciesController';

export function createDndRouter(): express.Router {
  const router = express.Router();

  // TODO : Find a way to remove all of this or reduce it
  const charClassRepository = new DndApiCharClassRepository();
  const fetchCharClassesUseCase = new FetchCharClassesUseCase(charClassRepository);
  const charClassController = new CharClassController(fetchCharClassesUseCase);

  const subSpeciesRepository = new DndApiSubSpeciesRepository();
  const fetchSubSpeciesUseCase = new FetchSubSpeciesUseCase(subSpeciesRepository);
  const subSpeciesController = new SubSpeciesController(fetchSubSpeciesUseCase);

  router.get('/classes', async (_request, response) => {
    try {
      const result = await charClassController.fetchAllCharClasses();
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.get('/subspecies', async (_request, response) => {
    try {
      const result = await subSpeciesController.getSubSpecies(_request, response);
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