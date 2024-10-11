import { FetchCharClassesUseCase } from "../../usecases/FetchCharClassesUseCase";
import { DndApiCharClassRepository } from "../../infrastructure/repositories/DndApiCharClassesRepository";

export class CharClassController {
  private fetchCharClassesUseCase: FetchCharClassesUseCase;

  constructor() {
    const repo = new DndApiCharClassRepository();
    this.fetchCharClassesUseCase = new FetchCharClassesUseCase(repo);
  }

  async fetchAllCharClasses(): Promise<any> {
    const charClasses = await this.fetchCharClassesUseCase.execute();
    return charClasses;
  }
}