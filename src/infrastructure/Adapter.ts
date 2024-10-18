import { Alignment } from "./../domain/entities/alignment";
import { Spell } from "./../domain/entities/spell";
import { Mastery } from "./../domain/entities/mastery";
import { CharacterClass } from "./../domain/entities/characterClass";

type DataAlignment = {
  results: { index: string; name: string }[];
};

type DataSpell = {
  index: string;
  name: string;
}

type DataSpellCharacteristics = {
  index: string;
  name: string;
}

export type ClassDict = {
  save_throws: string;
  base_masteries: Mastery[];
  bonus_masteries: Mastery[];
}

type DataClass = {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { index: string; name: string }[] }[];
  saving_throws: { name: string }[];
  spellcasting_ability?: { url: string };
  spells?: string;
}

export class Adapter {
  private spells: Spell[] = [];
  private spellcasting_ability: string = "";

  public async deserializeAlignment(response: Response): Promise<Alignment[]> {
    try {
      const data = (await response.json()) as DataAlignment;
      return data.results.map(alignment => new Alignment(alignment.index, alignment.name));
    } catch (error) {
      console.error("Error deserializing alignments:", error);
      throw error;
    }
  }

  public async deserializeSpells(response: Response) {
    try {
      const spellsData = await response.json() as { results: DataSpell[] };
      this.spells = spellsData.results.map(spell => new Spell(spell.index, spell.name));
    } catch (error) {
      console.error("Error deserializing spells:", error);
      throw error;
    }
  }

  public async deserializeAbilities(response: Response) {
    try {
      const abilityData = await response.json() as DataSpellCharacteristics;
      this.spellcasting_ability = abilityData.name;
    } catch (error) {
      console.error("Error deserializing abilities:", error);
      throw error;
    }
  }

  public async deserializeClass(class_data: DataClass): Promise<CharacterClass> {
    try {
      const save_throws = class_data.saving_throws.map(save => save.name).join(", ");
      const base_masteries = class_data.proficiencies.map(proficiency => new Mastery(proficiency.index, proficiency.name));

      const bonus_masteries = class_data.proficiency_choices.flatMap(choice => {
        if (choice.from && Array.isArray(choice.from)) {
          return choice.from.map(proficiency => new Mastery(proficiency.index, proficiency.name));
        }
        return [];
      });

      return new CharacterClass(
        class_data.index,
        class_data.name,
        base_masteries,
        bonus_masteries,
        save_throws,
        this.spellcasting_ability,
        this.spells
      );
    } catch (error) {
      console.error("Error deserializing character class:", error);
      throw error;
    }
  }
}
