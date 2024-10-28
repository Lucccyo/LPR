import { Alignment } from "../entities/alignment";
import { CharacterClass } from "../entities/characterClass";
import { Specie } from '../entities/specie';

export type FetchReturn = {
  classes: CharacterClass[],
  alignments: Alignment[],
  species: Specie[]
}

export interface ApiRepository {
  loadClasses(): Promise<Response>;
  loadAlignments(): Promise<Response>;
  loadSpecies(): Promise<Response>;

  getClasses(): Promise<CharacterClass[]>;
  getAlignments(): Promise<Alignment[]>;
  getSpecies(): Promise<Specie[]>;

  getAll(): Promise<FetchReturn>;
}