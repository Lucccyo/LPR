import { Specie } from "../../domain/entities/specie";
import { Mastery } from "../../domain/entities/mastery";
import { Language } from "../../domain/entities/language";
import { Trait } from "../../domain/entities/trait";
import { Bonus } from "../../domain/entities/bonus";
import { SubSpecies } from "../../domain/entities/subSpecies";
import { SpeciesRepository } from "../../domain/repositories/SpeciesRepository";

interface RaceApiResponse {
  index: string;
  name: string;
  size: number;
  languages: { url: string }[];
  traits: { url: string }[];
  subraces: { url: string }[];
  starting_proficiencies: { index: string; name: string; url: string }[];
  ability_bonuses: { bonus: number; ability_score: { name: string } }[];
}

interface LanguageApiResponse {
  index: string;
  name: string;
}

interface TraitApiResponse {
  index: string;
  name: string;
}

interface SubSpeciesApiResponse {
  index: string;
  name: string;
}

interface RaceListApiResponse {
  results: { url: string }[];
}

export class DndApiSpeciesRepository implements SpeciesRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/races";

  private async fetchLanguages(languageUrls: string[]): Promise<Language[]> {
    const languageFetches = languageUrls.map(async (url) => {
      const response = await fetch(url);
      const data = (await response.json()) as LanguageApiResponse;
      return new Language(data.index, data.name);
    });
    return await Promise.all(languageFetches);
  }

  private async fetchTraits(traitUrls: string[]): Promise<Trait[]> {
    const traitFetches = traitUrls.map(async (url) => {
      const response = await fetch(url);
      const data: TraitApiResponse = (await response.json()) as TraitApiResponse;
      return new Trait(data.index, data.name);
    });
    return await Promise.all(traitFetches);
  }

  private async fetchSubSpecies(subspeciesUrl: string): Promise<SubSpecies | undefined> {
    if (!subspeciesUrl) return undefined;
    const response = await fetch(subspeciesUrl);
    const data = (await response.json()) as SubSpeciesApiResponse;
    return new SubSpecies(data.index, data.name);
  }

  private async fetchMasteries(proficiencyData: { index: string; name: string; url: string }[]): Promise<Mastery[]> {
    if (!proficiencyData || proficiencyData.length === 0) {
      return [];
    }

    const masteries = proficiencyData.map((proficiency) => {
      return new Mastery(proficiency.index, proficiency.name);
    });

    return masteries;
  }

  private fetchBonuses(bonusData: { bonus: number; ability_score: { name: string } }[]): Bonus[] {
    return bonusData.map((bonus) => new Bonus(bonus.ability_score.name, bonus.bonus));
  }

  public async fetchAll(): Promise<Specie[]> {
    const response = await fetch(this.apiUrl);
    const data: RaceListApiResponse = (await response.json()) as RaceListApiResponse;

    const speciesFetches = data.results.map(async (race: { url: string }) => {
      const raceResponse = await fetch(`https://www.dnd5eapi.co${race.url}`);
      const raceData: RaceApiResponse = (await raceResponse.json()) as RaceApiResponse;

      const languageUrls = raceData.languages.map((lang: { url: string }) => `https://www.dnd5eapi.co${lang.url}`);
      const baseLanguages = await this.fetchLanguages(languageUrls);

      const traitUrls = raceData.traits.map((trait: { url: string }) => `https://www.dnd5eapi.co${trait.url}`);
      const baseTraits = await this.fetchTraits(traitUrls);

      const baseMasteries = await this.fetchMasteries(raceData.starting_proficiencies);

      const bonuses = this.fetchBonuses(raceData.ability_bonuses);

      let subspecies: SubSpecies | undefined = undefined;
      if (raceData.subraces.length > 0) {
        const subspeciesUrl = `https://www.dnd5eapi.co${raceData.subraces[0].url}`;
        subspecies = await this.fetchSubSpecies(subspeciesUrl);
      }

      return new Specie(
        raceData.index,
        raceData.name,
        raceData.size,
        baseMasteries,
        [], // bonus_masteries placeholder
        baseLanguages,
        [], // bonus_language placeholder
        baseTraits,
        bonuses,
        subspecies,
      );
    });

    return await Promise.all(speciesFetches);
  }
}
