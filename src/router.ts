import express from "express";

import { ApiController } from './interfaces/controllers/apiController';

export function createDndRouter(): express.Router {
  const router = express.Router();
  const apiController = new ApiController();

  router.get('/all', async (_request, response) => {
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
      if (index == null || name == null || user_index == null || character_class_index == null) {
        response.status(400).json({ error: "Missing required fields" });
        return;
      }

      const character = new UserCharacter(index, name, user_index, character_class_index);
      const result = await userCharController.characterSave(character);

      response.json(result);
    } catch (error) {
      return handleError(error, response);
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
