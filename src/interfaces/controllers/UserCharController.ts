import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { DatabaseFactory } from "../../infrastructure/factories/DatabaseFactory";
import { SaveCharacterUseCase } from "../../usecases/SaveCharacterUseCase";

const databaseRepository: DatabaseRepository = new DatabaseFactory().getRepository();
const saveCharacterUseCase = new SaveCharacterUseCase(databaseRepository);

export class UserCharController {
  async characterSave(character: UserCharacter): Promise<void> {
    return await saveCharacterUseCase.execute(character);
  }
}
