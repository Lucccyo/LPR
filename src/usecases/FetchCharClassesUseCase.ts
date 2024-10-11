import { CharClass } from "../entities/CharClass";
import { CharClassRepository } from "../repositories/CharClassRepository";

export class FetchCharClassesUseCase {
    constructor(private charClassRepository: CharClassRepository) {}

    async execute(): Promise<CharClass[]> {
        const charClassData = await this.charClassRepository.fetchAll();
        return charClassData.map(
            (data: any) => new CharClass(data.index, data.name, data.url)
          );
    }
}