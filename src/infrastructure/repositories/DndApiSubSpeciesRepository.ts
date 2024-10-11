import { SubSpeciesRepository } from "../../domain/repositories/SubSpeciesRepository";
import { SubSpecies } from "../../domain/entities/subSpecies";

export class DndApiSubSpeciesRepository implements SubSpeciesRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/subraces";

  async fetchAll(): Promise<SubSpecies[]> {
    const response = await fetch(this.apiUrl);
    const data = await response.json() as { results: any[] };

    const subSpeciesPromises = data.results.map(async (subRace: any) => {
      const detailResponse = await fetch(`${this.apiUrl}/${subRace.index}`);
      const detailData = await detailResponse.json() as { index: string, name: string };
      return new SubSpecies(detailData.index, detailData.name);
    });

    return Promise.all(subSpeciesPromises);
  }
}