import { Alignment } from "../entities/alignment";
import { CharacterClass } from "../entities/characterClass";
import { Race } from '../entities/race';

export type FetchReturn = {
  classes: CharacterClass[],
  alignments: Alignment[],
  races: Race[]
}

export interface ApiRepository {
  loadClasses(): Promise<Response>;
  loadAlignments(): Promise<Response>;
  loadRaces(): Promise<Response>;

  getClasses(): Promise<CharacterClass[]>;
  getAlignments(): Promise<Alignment[]>;
  getRaces(): Promise<Race[]>;

  getAll(): Promise<FetchReturn>;
}