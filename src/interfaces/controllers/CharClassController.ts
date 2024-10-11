import { FetchCharClassesUseCase } from "../../usecases/FetchCharClassesUseCase";

export class CharClassController {
  constructor(private fetchCharClassesUseCase: FetchCharClassesUseCase) {}

  async fetchAllCharClasses(): Promise<any> {
    const charClasses = await this.fetchCharClassesUseCase.execute();
    return charClasses;
  }
}