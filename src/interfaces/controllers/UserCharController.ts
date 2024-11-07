import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { DatabaseFactory } from "../../infrastructure/factories/DatabaseFactory";
import { CharacterUseCase } from "../../usecases/CharacterUseCase";

const databaseRepository: DatabaseRepository = new DatabaseFactory().getRepository();
const characterUseCase = new CharacterUseCase(databaseRepository);

export class UserCharController {
  async characterGet(index: number): Promise<UserCharacter | null> {
    return await characterUseCase.getCharacter(index);
  }

  async characterSave(character: UserCharacter): Promise<void> {
    return await characterUseCase.saveCharacter(character);
  }
}
