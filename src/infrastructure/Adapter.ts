import { Alignment } from "./../domain/entities/alignment";
import { Spell } from "./../domain/entities/spell";
import { Proficiency } from "./../domain/entities/proficiency";
import { CharacterClass } from "./../domain/entities/characterClass";
import { Language } from "./../domain/entities/language";
import { Trait } from "./../domain/entities/trait";
import { Subrace } from "./../domain/entities/subrace";
import { AbilityBonus } from "./../domain/entities/abilityBonus";
import { Race } from "./../domain/entities/race";

type DataAlignment = {
  results: { index: string; name: string }[];
};

type DataSpell = {
  index: string;
  name: string;
  level: number;
}

export type ClassDict = {
  save_throws: string;
  proficiencies: Proficiency[];
  proficiencies_choice: Proficiency[];
}

type DataClass = {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { options: { item: { index: string; name: string } }[] } }[];
  saving_throws: { name: string }[];
  spellcasting?: { spellcasting_ability: { name: string } };
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
  starting_proficiency_options?: { from: { options: { item: { index: string; name: string } }[] } };
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

type DataSubRace = {
  index: string;
  name: string;
  language_options?: {
    choose: number;
    from: {
      options: { item: { index: string; name: string } }[];
    }
  };
}

export class Adapter {
  private spells: Spell[] = [];

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
      this.spells = spellsData.results
        .filter(spell => spell.level === 0)
        .map(spell => new Spell(spell.index, spell.name));
    } catch (error) {
      console.error("Error deserializing spells:", error);
      throw error;
    }
  }

  public async deserializeClass(class_data: DataClass): Promise<CharacterClass> {
    try {
      const proficiencies = class_data.proficiencies.map(proficiency => new Proficiency(proficiency.index, proficiency.name));

      const proficiencies_choice = class_data.proficiency_choices.flatMap(choice => {
        if (choice.from && Array.isArray(choice.from.options)) {
          return choice.from.options.flatMap(option => {
            if (option.item && option.item.index && option.item.name) {
              return new Proficiency(option.item.index, option.item.name);
            }
            return [];
          });
        }
        return [];
      });
      let spellcasting_ability = class_data.spellcasting?.spellcasting_ability?.name ?? "";
      return new CharacterClass(
        class_data.index,
        class_data.name,
        proficiencies,
        proficiencies_choice,
        class_data.saving_throws.map(st => st.name),
        spellcasting_ability,
        this.spells
      );
    } catch (error) {
      console.error("Error deserializing character class:", error);
      throw error;
    }
  }

  private languages: Language[] = [];
  private traits: Trait[] = [];
  private subrace: Subrace[] = [];

  public async deserializeLanguages(response: Response) {
    try {
      let languagesData = await response.json() as DataLanguage | DataLanguage[];
      if (!Array.isArray(languagesData)) {
        languagesData = [languagesData];
      }
      languagesData.forEach(language => {
        this.languages.push(new Language(language.index, language.name));
      });
    } catch (error) {
      console.error("Error deserializing languages:", error);
      throw error;
    }
  }

  public async deserializeTraits(response: Response) {
    try {
      let traitsData = (await response.json()) as DataTrait | DataTrait[];
      if (!Array.isArray(traitsData)) {
        traitsData = [traitsData];
      }
      traitsData.forEach(trait => {
        this.traits.push(new Trait(trait.index, trait.name));
      })
    } catch (error) {
      console.error("Error deserializing traits:", error);
      throw error;
    }
  }

  public async deserializeSubRaces(response: Response) {
    try {
      let data = (await response.json()) as DataSubRace | DataSubRace[];
      if (!Array.isArray(data)) {
        data = [data];
      }

      const languageOptions = data[0].language_options
      ? data[0].language_options.from.options.map(option => ({
          index: option.item.index,
          name: option.item.name,
        }))
      : [];

      this.subrace = data.length > 0 ? [new Subrace(data[0].index, data[0].name, languageOptions)] : [];
    } catch (error) {
      console.error("Error deserializing sub races:", error);
      throw error;
    }
  }

  public async deserializeRace(race_data: DataRace): Promise<Race> {
    try {
      let proficiencies: Proficiency[] = [];
      if (race_data.starting_proficiencies && race_data.starting_proficiencies.length > 0) {
        race_data.starting_proficiencies.map((proficiency) => {
          proficiencies.push(new Proficiency(proficiency.index, proficiency.name));
        });
      };

      let proficiencies_choice: Proficiency[] = [];
      if (race_data.starting_proficiency_options && race_data.starting_proficiency_options.from.options) {
        proficiencies_choice = race_data.starting_proficiency_options.from.options.flatMap(option => {
          if (option.item && option.item.index && option.item.name) {
            return new Proficiency(option.item.index, option.item.name);
          }
          return [];
        });
      }

      let bonus = race_data.ability_bonuses.map((bonus) => new AbilityBonus(bonus.ability_score.name, bonus.bonus));
      const languages = this.languages;
      const traits = this.traits;
      const subrace = this.subrace;
      this.languages = [];
      this.traits = [];
      this.subrace = [];
      return new Race(
        race_data.index,
        race_data.name,
        race_data.size,
        proficiencies,
        proficiencies_choice,
        languages,
        traits,
        bonus,
        subrace
      );
    } catch (error) {
      console.error("Error deserializing character race:", error);
      throw error;
    }
  }
}
