import { SubSpeciesRepository } from '../domain/repositories/SubSpeciesRepository';
import { SubSpecies } from '../domain/entities/subSpecies';

export class FetchSubSpeciesUseCase {
  constructor(private subSpeciesRepo: SubSpeciesRepository) {}

  async execute(): Promise<SubSpecies[]> {
    const subSpeciesList = await this.subSpeciesRepo.fetchAll();
    return subSpeciesList.map(
      (data: any) => new SubSpecies(data.index, data.name)
    );
  }
}