import { SubSpecies } from '../entities/subSpecies';

export interface SubSpeciesRepository {
  fetchAll(): Promise<SubSpecies[]>;
}