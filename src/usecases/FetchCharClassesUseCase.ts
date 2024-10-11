import { CharacterClass } from "../domain/entities/characterClass";
import { CharClassRepository } from "../domain/repositories/CharClassRepository";

export class FetchCharClassesUseCase {
  constructor(private charClassRepository: CharClassRepository) {}

  async execute(): Promise<CharacterClass[]> {
    const charClasses = await this.charClassRepository.fetchAll();
    return charClasses;
  }
}