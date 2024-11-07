import { ApiRepository } from "../domain/repositories/apiRepository";

export class FetchApiUseCase {
  constructor(private apiRepository: ApiRepository) {}

  async fetchAll(): Promise<object> {
    const result = await this.apiRepository.getAll();
    return result;
  }
}
