import express from 'express';
import { CharClassController } from './interfaces/controllers/CharClassController';
import { DndApiCharClassRepository } from './infrastructure/repositories/DndApiCharClassesRepository';
import { FetchCharClassesUseCase } from './usecases/FetchCharClassesUseCase';

export function createDndRouter(): express.Router {
  const router = express.Router();

  const charClassRepository = new DndApiCharClassRepository();
  const fetchCharClassesUseCase = new FetchCharClassesUseCase(charClassRepository);
  const charClassController = new CharClassController(fetchCharClassesUseCase);

  router.get('/classes', async (_request, response) => {
    try {
      const result = await charClassController.fetchAllCharClasses();
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