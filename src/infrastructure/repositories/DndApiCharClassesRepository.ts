import { CharClassRepository } from "../../domain/repositories/CharClassRepository";
import { CharacterClass } from "../../domain/entities/characterClass";

export class DndApiCharClassRepository implements CharClassRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/classes";

  async fetchAll(): Promise<CharacterClass[]> {
    const response = await fetch(this.apiUrl);
    const data = await response.json() as { results: any[] };
    return data.results.map((result: any) => new CharacterClass(
      result.index,
      result.name,
      result.url,
      [],
      "",
      "",
      []
    ));
  }
}