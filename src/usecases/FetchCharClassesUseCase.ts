import { CharClass } from "../domain/entities/CharClass";
import { CharClassRepository } from "../domain/repositories/CharClassRepository";

export class FetchCharClassesUseCase {
  constructor(private charClassRepository: CharClassRepository) {}

  async execute(): Promise<CharClass[]> {
    const charClassData = await this.charClassRepository.fetchAll();
    return charClassData.map(
      (data: any) => new CharClass(data.index, data.name, data.url)
    );
  }
}