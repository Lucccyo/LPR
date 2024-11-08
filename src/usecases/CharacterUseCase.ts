import { UserCharacter } from "../domain/entities/userCharacter";
import { DatabaseRepository } from "../domain/repositories/DatabaseRepository";
import { ApiRepository } from "../domain/repositories/apiRepository";

export class CharacterUseCase {
  constructor(
    private databaseRepository: DatabaseRepository,
    private apiRepository: ApiRepository,
  ) {}

  async getAllCharactersId(): Promise<number[]> {
    return (await this.databaseRepository.getAll() as number[])
  }

  async getCharacter(index: number): Promise<UserCharacter | null> {
    return (await this.databaseRepository.read(index)) as UserCharacter | null;
  }

  async saveCharacter(requestData: any): Promise<void> {
    const {
      index,
      name,
      user_index,
      character_class,
      prof_choice,
      character_alignment,
      choosen_race,
      choosen_subrace,
      choosen_language,
    } = requestData;

    if (
      !index ||
      !name ||
      !user_index ||
      !character_class ||
      !prof_choice ||
      !choosen_race
    ) {
      throw new Error("Missing required fields");
    }

    const allData = await this.apiRepository.getAll();
    const { classes, alignments, races } = allData;

    const characterClass = classes.find(cls => cls.index === character_class);
    const alignment = alignments.find(alg => alg.index === character_alignment);
    const race = races.find(r => r.index === choosen_race);
    const subrace = race?.subraces?.find(sr => sr.index === choosen_subrace);
    const language = subrace?.language_option?.find(lang => lang.index === choosen_language);
    const proficiency = characterClass?.proficiency_choices?.find(prof => prof.index === prof_choice);

  if (!characterClass || !alignment || !race) {
    throw new Error("One or more required entities not found");
  }    const character = new UserCharacter(
      index,
      name,
      user_index,
      characterClass,
      alignment.name,
      race
    );

    if (subrace) {
      character.character_race.subraces = [subrace];
      if (language) {
        character.character_race.languages.push(language);
      }
    }
    
    if (proficiency) {
      character.character_class.proficiencies.push(proficiency);
    }

    if (this.databaseRepository.read(character.index) !== null) {
      await this.databaseRepository.update(character.index, character);
    } else {
      await this.databaseRepository.create(character.toJSON());
    }
  }
}
