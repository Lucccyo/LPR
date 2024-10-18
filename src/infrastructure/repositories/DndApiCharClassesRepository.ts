import { CharClassRepository } from "../../domain/repositories/CharClassRepository";
import { CharacterClass } from "../../domain/entities/characterClass";

import { Adapter } from "../Adapter";
const adapter = new Adapter();

type DataClass = {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { index: string; name: string }[] }[];
  saving_throws: { name: string }[];
  spellcasting_ability?: { url: string };
  spells?: string;
};

type AllClassesBox = {
  results: { url: string }[];
};

export class DndApiCharClassRepository implements CharClassRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/classes";

  public async fetchAll(): Promise<CharacterClass[]> {
    const characterClasses: CharacterClass[] = [];
    try {
      const globalResponse = await fetch(this.apiUrl);
      const data: AllClassesBox = (await globalResponse.json()) as AllClassesBox;
      for (const result of data.results) {
        const class_url = result.url;
        const class_response = await fetch(`https://www.dnd5eapi.co${class_url}`);
        const class_data = (await class_response.json()) as DataClass;
        if (class_data.spells) {
          const spells_response = await fetch(`https://www.dnd5eapi.co${class_data.spells}`);
          await adapter.deserializeSpells(spells_response);
        }
        if (class_data.spellcasting_ability?.url) {
          const ability_response = await fetch(`https://www.dnd5eapi.co${class_data.spellcasting_ability.url}`);
          await adapter.deserializeAbilities(ability_response);
        }
        const charClass = await adapter.deserializeClass(class_data); //Baaaaah c'est pas le même type que les autres deserialize
        characterClasses.push(charClass);
      }
    } catch (error) {
      console.error("Error fetching character classes:", error);
      throw error;
    }
    return characterClasses;
  }
}
