import { FetchCharClassesUseCase } from "../../usecases/FetchCharClassesUseCase";
import { CharacterClass } from "../../domain/entities/characterClass";

export class CharClassController {
  constructor(private fetchCharClassesUseCase: FetchCharClassesUseCase) {}

  async fetchAllCharClasses(): Promise<CharacterClass[]> {
    const charClasses = await this.fetchCharClassesUseCase.execute();
    return charClasses;
  }
}