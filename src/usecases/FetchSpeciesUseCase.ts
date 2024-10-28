import { SpeciesRepository } from "../domain/repositories/SpeciesRepository";
import { Specie } from "../domain/entities/specie";

export class FetchSpeciesUseCase {
  constructor(private speciesRepo: SpeciesRepository) {}

  async execute(): Promise<Specie[]> {
    const subSpeciesList = await this.speciesRepo.fetchAll();
    return subSpeciesList;
  }
}
