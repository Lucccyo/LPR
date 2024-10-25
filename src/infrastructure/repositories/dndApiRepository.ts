import { ApiRepository, FetchReturn } from "../../domain/repositories/apiRepository";
import { Adapter } from "../../infrastructure/Adapter";
import { Alignment } from "../../domain/entities/alignment";
import { Specie } from "../../domain/entities/specie";
import { CharacterClass } from "../../domain/entities/characterClass";

type AllClassesBox = {
  results: { url: string }[];
}

// TODO: Wait for andré response
type DataClass = {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { index: string; name: string }[] }[];
  saving_throws: { name: string }[];
  spellcasting_ability?: { url: string };
  spells?: string;
}

export class DndApiRepository implements ApiRepository {
    private readonly alignment_url = "https://www.dnd5eapi.co/api/alignments";
    private readonly classes_url = "https://www.dnd5eapi.co/api/classes";

    private readonly adapter: Adapter = new Adapter();

    public async loadAlignments(): Promise<Response> {
        const response = await fetch(this.alignment_url);
        return response;
    }

    public async loadClasses(): Promise<Response> {
        const response = await fetch(this.classes_url);
        return response;
    }

    public async loadSpecies(): Promise<Response> {
        const response = await fetch("https://www.dnd5eapi.co/api/species");
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
        const class_response   = await fetch(`https://www.dnd5eapi.co${class_url}`);
        const class_data = await class_response.json() as DataClass;
        if (class_data.spells) {
          const spells_response = await fetch(`https://www.dnd5eapi.co${class_data.spells}`);
          await this.adapter.deserializeSpells(spells_response);
        }
        if (class_data.spellcasting_ability?.url) {
          const ability_response = await fetch(`https://www.dnd5eapi.co${class_data.spellcasting_ability.url}`);
          await this.adapter.deserializeAbilities(ability_response);
        }
        const charClass = await this.adapter.deserializeClass(class_data);
        characterClasses.push(charClass);
      }
      return characterClasses;
    }

    public async getSpecies(): Promise<Specie[]> {
        // const json_data = this.loadSpecies();
        // call adapter here
        return [];
    }

    public async getAll(): Promise<FetchReturn> {
        const [classes, alignments, species] = await Promise.all([
            this.getClasses(),
            this.getAlignments(),
            this.getSpecies()
        ]);
        return {
            classes,
            alignments,
            species
        };
    }
}
