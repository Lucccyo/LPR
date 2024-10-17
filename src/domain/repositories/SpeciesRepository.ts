import { Specie } from '../entities/specie';

export interface SpeciesRepository {
  fetchAll(): Promise<Specie[]>;
}
