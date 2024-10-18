import express from "express";

import { CharClassController } from "./interfaces/controllers/CharClassController";
import { DndApiCharClassRepository } from "./infrastructure/repositories/DndApiCharClassesRepository";
import { FetchCharClassesUseCase } from "./usecases/FetchCharClassesUseCase";

import { SpeciesController } from "./interfaces/controllers/SpeciesController";
import { DndApiSpeciesRepository } from "./infrastructure/repositories/DndApiSpeciesRepository";
import { FetchSpeciesUseCase } from "./usecases/FetchSpeciesUseCase";

import { ApiController } from "./interfaces/controllers/apiController";
import { DndApiRepository } from "./infrastructure/repositories/dndApiRepository";
import { FetchApiUseCase } from "./usecases/FetchApiUseCase";

import { UserCharController } from "./interfaces/controllers/UserCharController";
import { UserCharacter } from "./domain/entities/userCharacter";

export function createDndRouter(): express.Router {
  const router = express.Router();

  const charClassRepository = new DndApiCharClassRepository();
  const fetchCharClassesUseCase = new FetchCharClassesUseCase(charClassRepository);
  const charClassController = new CharClassController(fetchCharClassesUseCase);

  const speciesRepository = new DndApiSpeciesRepository();
  const fetchSpeciesUseCase = new FetchSpeciesUseCase(speciesRepository);
  const speciesController = new SpeciesController(fetchSpeciesUseCase);

  const apiRepository = new DndApiRepository();
  const fetchApiUseCase = new FetchApiUseCase(apiRepository);
  const apiController = new ApiController(fetchApiUseCase);

  const userCharController = new UserCharController();

  router.get("/classes", async (_request, response) => {
    try {
      const result = await charClassController.fetchAllCharClasses();
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.get("/species", async (_request, response) => {
    try {
      const result = await speciesController.getSpecies(_request, response);
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.get("/all", async (_request, response) => {
    try {
      const result = await apiController.fetchAllApi();
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.post("/character", express.json(), async (_request, response) => {
    try {
      console.log("Request body:", _request.body);
      const { index, name, user_index, character_class_index } = _request.body || {};
      if (!index || !name || !user_index || !character_class_index) {
        response.status(400).json({ error: "Missing required fields" });
        return;
      }

      const character = new UserCharacter(index, name, user_index, character_class_index);
      const result = await userCharController.characterSave(character);

      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  return router;
}

function handleError(error: unknown, response: express.Response): void {
  console.error("Error in DnD router:", error);
  if (error instanceof Error) {
    response.status(500).json({ error: error.message });
  } else {
    response.status(500).json({ error: "An unexpected error occurred" });
  }
}
