import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";

export class SaveCharacterUseCase {
  constructor(private databaseRepository: DatabaseRepository) {}

  async execute(character: UserCharacter) {
    if (this.databaseRepository.read(character.index) !== null) {
      return this.databaseRepository.update(character.index, character);
    }

    return this.databaseRepository.create(character);
  }
}
