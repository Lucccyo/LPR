import express from "express";

import { ApiController } from "./interfaces/controllers/apiController";
import { UserCharController } from "./interfaces/controllers/UserCharController";

export function createDndRouter(): express.Router {
  const router = express.Router();
  const apiController = new ApiController();
  const userCharController = new UserCharController();

  router.get("/all", async (_request, response) => {
    try {
      const result = await apiController.fetchAllApi();
      response.json(result);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.get("/character/:index", async (request, response) => {
    try {
      const index = parseInt(request.params.index, 10);
      if (isNaN(index)) {
        response.status(400).json({ error: "Invalid index" });
        return;
      }

      const character = await userCharController.characterGet(index);
      if (character == null) {
        response.status(404).json({ error: "Character not found" });
        return;
      }

      response.json(character);
    } catch (error) {
      handleError(error, response);
    }
  });

  router.post("/character", express.json(), async (_request, response) => {
    try {
      const requestData = _request.body || {};
      await userCharController.characterSave(requestData);
      response.status(201).json({ message: "Character created successfully" });
    } catch (error) {
      return handleError(error, response);
    }
  });

  router.get("/characters", async (_request, response) => {
    try {
      const result = await userCharController.characterGetList();
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
