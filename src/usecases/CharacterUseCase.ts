import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";

export class CharacterUseCase {
  constructor(private databaseRepository: DatabaseRepository) {}

  async getCharacter(index: number): Promise<UserCharacter | null> {
    return (await this.databaseRepository.read(index)) as UserCharacter | null;
  }

  async saveCharacter(character: UserCharacter) {
    if (this.databaseRepository.read(character.index) !== null) {
      return this.databaseRepository.update(character.index, character);
    }

    return this.databaseRepository.create(character.toJSON());
  }
}
