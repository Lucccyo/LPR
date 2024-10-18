import { CharacterClass } from "../entities/characterClass";

export interface CharClassRepository {
  fetchAll(): Promise<CharacterClass[]>;
}
