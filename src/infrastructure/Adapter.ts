import { Alignment } from "./../domain/entities/alignment";
import { Spell } from "./../domain/entities/spell";
import { Mastery } from "./../domain/entities/mastery";
import { CharacterClass } from "./../domain/entities/characterClass";
import { Language } from "./../domain/entities/language";
import { Trait } from "./../domain/entities/trait";
import { SubSpecie } from "./../domain/entities/subSpecie";
import { Bonus } from "./../domain/entities/bonus";
import { Specie } from "./../domain/entities/specie";

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

type DataSpecie = {
  index: string;
  name: string;
  size: number;
  languages: { url: string }[];
  traits: { url: string }[];
  subraces: { url: string }[];
  starting_proficiencies: { index: string; name: string; url: string }[];
  ability_bonuses: { bonus: number; ability_score: { name: string } }[];
}

type DataLanguage = {
  index: string;
  name: string;
}

type DataTrait = {
  index: string;
  name: string;
}

type DataSubSpecie = {
  index: string;
  name: string;
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

  private base_language: Language[] = [];
  private base_traits: Trait[] = [];
  private subSpecie: SubSpecie | undefined = undefined;

  public async deserializeLanguages(response: Response) {
    try {
      const languagesData = await response.json() as DataLanguage[];
      languagesData.forEach(language => {
        this.base_language.push(new Language(language.index, language.name));
      });
    } catch (error) {
      console.error("Error deserializing languages:", error);
      throw error;
    }
  }

  public async deserializeTraits(response: Response) {
    try {
      const traitsData = (await response.json()) as DataTrait[];
      traitsData.forEach(trait => {
        this.base_traits.push(new Trait(trait.index, trait.name));
      })
    } catch (error) {
      console.error("Error deserializing traits:", error);
      throw error;
    }
  }

  public async deserializeSubSpecies(response: Response) {
    try {
      const data = (await response.json()) as DataSubSpecie[];
      this.subSpecie = data.length > 0 ? new SubSpecie(data[0].index, data[0].name) : undefined;
    } catch (error) {
      console.error("Error deserializing sub species:", error);
      throw error;
    }
  }

  public async deserializeSpecie(specie_data: DataSpecie): Promise<Specie> {
    try {
      let base_masteries: Mastery[] = [];
      if (specie_data.starting_proficiencies && specie_data.starting_proficiencies.length > 0) {
        specie_data.starting_proficiencies.map((proficiency) => {
          const mastery = new Mastery(proficiency.index, proficiency.name);
          base_masteries.push(mastery);
        });
      };
      let bonus = specie_data.ability_bonuses.map((bonus) => new Bonus(bonus.ability_score.name, bonus.bonus));
      const base_language = this.base_language;
      const base_traits = this.base_traits;
      const subSpecie = this.subSpecie;
      this.base_language = [];
      this.base_traits = [];
      this.subSpecie = undefined;
      return new Specie(
        specie_data.index,
        specie_data.name,
        specie_data.size,
        base_masteries,
        [], // bonus_masteries placeholder
        base_language,
        [], // bonus_language placeholder
        base_traits,
        bonus,
        subSpecie
      );
    } catch (error) {
      console.error("Error deserializing character specie:", error);
      throw error;
    }
  }
}
