import { CharacterClass } from "../domain/entities/characterClass";
import { CharClassRepository } from "../domain/repositories/CharClassRepository";

export class FetchCharClassesUseCase {
  constructor(private charClassRepository: CharClassRepository) {}

  async execute(): Promise<CharacterClass[]> {
    const charClassData = await this.charClassRepository.fetchAll();
    return charClassData.map(
      (data: any) => new CharacterClass(data.index, data.name, data.url, [], "", "", [])
    );
  }
}