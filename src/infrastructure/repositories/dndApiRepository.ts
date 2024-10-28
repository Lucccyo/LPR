import { ApiRepository, FetchReturn } from "../../domain/repositories/apiRepository";
import { Adapter } from "../../infrastructure/Adapter";
import { Alignment } from "../../domain/entities/alignment";
import { Race } from "../../domain/entities/race";
import { CharacterClass } from "../../domain/entities/characterClass";

type AllClassesBox = {
  results: { url: string }[];
}

type AllRacesBox = {
  results: { url: string }[];
}

// TODO: Wait for andré response
type DataClass = {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { index: string; name: string }[] }[];
  saving_throws: { name: string }[];
  spellcasting_ability?: { name: string };
  spells?: string;
}

type DataRace = {
  index: string;
  name: string;
  size: number;
  languages: { url: string }[];
  traits: { url: string }[];
  subraces: { url: string }[];
  starting_proficiencies: { index: string; name: string; url: string }[];
  ability_bonuses: { bonus: number; ability_score: { name: string } }[];
}

export class DndApiRepository implements ApiRepository {
    private readonly alignment_url = "https://www.dnd5eapi.co/api/alignments";
    private readonly classes_url = "https://www.dnd5eapi.co/api/classes";
    private readonly races_url = "https://www.dnd5eapi.co/api/races";

    private readonly adapter: Adapter = new Adapter();

    public async loadAlignments(): Promise<Response> {
        const response = await fetch(this.alignment_url);
        return response;
    }

    public async loadClasses(): Promise<Response> {
        const response = await fetch(this.classes_url);
        return response;
    }

    public async loadRaces(): Promise<Response> {
        const response = await fetch(this.races_url);
        return response;
    }

    public async getAlignments(): Promise<Alignment[]> {
        const json_data = await this.loadAlignments();
        const alignments = this.adapter.deserializeAlignment(json_data);
        return alignments;
    }

    public async getClasses(): Promise<CharacterClass[]> {
      let characterClasses : CharacterClass[] = [];
      const json_data = await this.loadClasses();
      const data: AllClassesBox = await json_data.json() as AllClassesBox;
      for (const result of data.results) {
        const class_url = result.url;
        const class_response = await fetch(`https://www.dnd5eapi.co${class_url}`);
        const class_data = await class_response.json() as DataClass;
        if (class_data.spells) {
          const spells_response = await fetch(`https://www.dnd5eapi.co${class_data.spells}`);
          await this.adapter.deserializeSpells(spells_response);
        }
        const charClass = await this.adapter.deserializeClass(class_data);
        characterClasses.push(charClass);
      }
      return characterClasses;
    }

    public async getRaces(): Promise<Race[]> {
      let races: Race[] = [];
      const json_data = await this.loadRaces();
      const data: AllRacesBox = await json_data.json() as AllRacesBox;
      for (const result of data.results) {
        const race_url = result.url;
        const race_response = await fetch(`https://www.dnd5eapi.co${race_url}`);
        const race_data = await race_response.json() as DataRace;
  // language
        if (race_data.languages) {
          const language_urls : string[] = race_data.languages.map((lang: { url: string }) => `https://www.dnd5eapi.co${lang.url}`);
          const responses = await Promise.all(language_urls.map(url => fetch(url)));
          for (const response of responses) {
            await this.adapter.deserializeLanguages(response);
          }
        }
  // traits
        const trait_url : string[] = race_data.traits.map((trait: { url: string }) => `https://www.dnd5eapi.co${trait.url}`);
        const responses = await Promise.all(trait_url.map(url => fetch(url)));
        for (const response of responses) {
          await this.adapter.deserializeTraits(response);
        }
  // subrace
        if (race_data.subraces.length > 0) {
          const subrace_response = await fetch(`https://www.dnd5eapi.co${race_data.subraces[0].url}`); // TODO normal de prendre que le 0 ???
          await this.adapter.deserializeSubRaces(subrace_response);
        }
        const race = await this.adapter.deserializeRace(race_data);
        races.push(race);
      }
      return races;
    }

    public async getAll(): Promise<FetchReturn> {
        const [classes, alignments, races] = await Promise.all([
            this.getClasses(),
            this.getAlignments(),
            this.getRaces()
        ]);
        return {
            classes,
            alignments,
            races
        };
    }
}
