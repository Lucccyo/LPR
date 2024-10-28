import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";

export class SaveCharacterUseCase {
  constructor(private databaseRepository: DatabaseRepository) {}

  async execute(character: UserCharacter) {
    if ((await this.databaseRepository.read(character.index)) !== null) {
      throw new Error("Character already exists");
    }
    return await this.databaseRepository.update(character.index, character);
  }
}
