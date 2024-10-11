import { CharClassRepository } from "../../domain/repositories/CharClassRepository";

export class DndApiCharClassRepository implements CharClassRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/classes";

  async fetchAll(): Promise<any[]> {
    const response = await fetch(this.apiUrl);
    const data = await response.json() as { results: any[] };
    console.log(data);
    return data.results;
  }
}