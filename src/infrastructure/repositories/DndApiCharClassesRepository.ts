import { CharClassRepository } from "../../domain/repositories/CharClassRepository";
import { CharacterClass } from "../../domain/entities/characterClass";
import { Mastery } from "../../domain/entities/mastery";
import { Spell } from "../../domain/entities/spell";

interface ClassApiResponse {
  index: string;
  name: string;
  proficiencies: { index: string; name: string }[];
  proficiency_choices: { from?: { index: string; name: string }[] }[];
  saving_throws: { name: string }[];
  spellcasting_ability?: { url: string };
  spells?: string;
}

interface AbilityScoreApiResponse {
  index: string;
  name: string;
}

interface SpellApiResponse {
  index: string;
  name: string;
}

interface ClassListApiResponse {
  results: { url: string }[];
}

export class DndApiCharClassRepository implements CharClassRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/classes";

  public async fetchAll(): Promise<CharacterClass[]> {
    const response = await fetch(this.apiUrl);
    const data: ClassListApiResponse = await response.json() as ClassListApiResponse;

    const characterClassFetches = data.results.map(async (charClass: { url: string }) => {
      const classResponse = await fetch(`https://www.dnd5eapi.co${charClass.url}`);
      const classData: ClassApiResponse = await classResponse.json() as ClassApiResponse;

      const baseMasteries = classData.proficiencies.map((proficiency: { index: string; name: string }) => {
        return new Mastery(proficiency.index, proficiency.name);
      });

      const bonusMasteries = classData.proficiency_choices.map((choice) => {
        if (choice.from && Array.isArray(choice.from)) {
          return choice.from.map((proficiency: { index: string; name: string }) => {
            return new Mastery(proficiency.index, proficiency.name);
          });
        }
        return [];
      }).flat();

      const saveThrows = classData.saving_throws.map((save: { name: string }) => save.name).join(", ");

      let baseSpells: Spell[] = [];
      if (classData.spells) {
        const spellsResponse = await fetch(`https://www.dnd5eapi.co${classData.spells}`);
        const spellsData = await spellsResponse.json() as { results: SpellApiResponse[] };
        baseSpells = spellsData.results.map((spell: SpellApiResponse) => {
          return new Spell(spell.index, spell.name);
        });
      }

      // TODO: Make this work
      let spellCharacteristics = "";
      if (classData.spellcasting_ability?.url) {
        const abilityResponse = await fetch(`https://www.dnd5eapi.co${classData.spellcasting_ability.url}`);
        const abilityData: AbilityScoreApiResponse = await abilityResponse.json() as AbilityScoreApiResponse;
        spellCharacteristics = abilityData.name;
      }

      return new CharacterClass(
        classData.index,
        classData.name,
        baseMasteries,
        bonusMasteries,
        saveThrows,
        spellCharacteristics,
        baseSpells
      );
    });

    return await Promise.all(characterClassFetches);
  }
}
