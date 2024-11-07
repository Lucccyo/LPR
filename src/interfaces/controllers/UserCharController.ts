import { UserCharacter } from "domain/entities/userCharacter";
import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { ApiRepository } from "domain/repositories/apiRepository";
import { DatabaseFactory } from "../../infrastructure/factories/DatabaseFactory";
import { ApiFactory } from "../../infrastructure/factories/apiFactory";
import { CharacterUseCase } from "../../usecases/CharacterUseCase";

const databaseRepository: DatabaseRepository = new DatabaseFactory().getRepository();
const apiRepository: ApiRepository = ApiFactory.createApiRepository();
const characterUseCase = new CharacterUseCase(databaseRepository, apiRepository);

export class UserCharController {
  async characterGet(index: number): Promise<UserCharacter | null> {
    return await characterUseCase.getCharacter(index);
  }

  async characterSave(requestData: any): Promise<void> {
    return await characterUseCase.saveCharacter(requestData);
  }

  async characterGetList(): Promise<number[] | null> {
    return await characterUseCase.getAllCharactersId();
  }
}
